<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Galerie</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <!-- Sofort sichtbare Minimal-UI -->
      <div v-if="!appReady" class="loading-container">
        <p>Wird geladen...</p>
      </div>

      <!-- Eigentlicher Inhalt, nur angezeigt wenn appReady=true -->
      <template v-if="appReady">
        <IonGrid v-if="photos.length > 0">
          <IonRow>
            <IonCol size="4" v-for="photo in photos" :key="photo.id">
              <IonImg :src="getPhotoSrc(photo.filepath)" />
            </IonCol>
          </IonRow>
        </IonGrid>
      </template>

      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton @click="takePhoto">
          <IonIcon name="camera" />
        </IonFabButton>
      </IonFab>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import {ref, onMounted, nextTick} from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol,
  IonImg, IonFab, IonFabButton, IonIcon, isPlatform
} from '@ionic/vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { v4 as uuidv4 } from 'uuid';

// Initialisierungszustand
const appReady = ref(false);
const photos = ref<Photo[]>([]);

// Interface für persistente Daten
interface Photo {
  id: string;
  filepath: string;
}

function getPhotoSrc(filepath: string): string {
  if (isPlatform('capacitor')) {
    return Capacitor.convertFileSrc(filepath);
  }
  return filepath;
}

function savePhotosState() {
  localStorage.setItem('photos', JSON.stringify(photos.value));
}

async function loadPhotos() {
  try {
    const raw = localStorage.getItem('photos');
    if (raw) {
      photos.value = JSON.parse(raw);
    }
  } catch (e) {
    console.error("Fehler beim Laden der Fotos aus localStorage", e);
    photos.value = [];
  }
}

async function takePhoto() {
  try {
    const perm = await Camera.checkPermissions();
    if (perm.camera !== 'granted') {
      const requestPerm = await Camera.requestPermissions();
      if (requestPerm.camera !== 'granted') return;
    }

    const image = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 90
    });

    if (!image.path) return;

    const fileName = `${uuidv4()}.jpeg`;
    const savedFile = await Filesystem.copy({
      from: image.path,
      to: fileName,
      toDirectory: Directory.Data,
    });

    photos.value.unshift({
      id: uuidv4(),
      filepath: savedFile.uri
    });

    savePhotosState();
  } catch (error) {
    console.error("Fehler bei der Fotoaufnahme:", error);
  }
}

// Zweistufiges Bootstrap-Verfahren
onMounted(() => {
  // Sofort einen sichtbaren DOM-Baum erzeugen
  console.log("App gestartet - Loading-Screen anzeigen");

  // Verzögere alle App-Logik mit setTimeout (0ms reicht)
  setTimeout(() => {
    console.log("Starte App-Initialisierung");

    // Lade Daten asynchron
    loadPhotos().then(() => {
      console.log("Fotos geladen, setze appReady=true");
      // Erst jetzt den Hauptinhalt anzeigen
      appReady.value = true;
    });
  }, 0);
});
</script>

<style scoped>
ion-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 20px;
  color: #666;
}
</style>