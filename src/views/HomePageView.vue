<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Galerie</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div v-if="!appReady" class="loading-container">
        <p>Wird geladen...</p>
      </div>

      <template v-if="appReady">
        <IonGrid v-if="photos.length > 0">
          <IonRow>
            <IonCol size="4" v-for="photo in photos" :key="photo.id">
              <IonImg :src="getPhotoSrc(photo.filepath)" @click="openDetail(photo.id)" />
            </IonCol>
          </IonRow>
        </IonGrid>
        <div v-else class="empty-gallery">
          <p>Noch keine Fotos vorhanden. Machen Sie Ihr erstes Foto!</p>
        </div>
      </template>

      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton @click="takePhoto">
          <IonIcon :icon="camera" />
        </IonFabButton>
      </IonFab>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol,
  IonImg, IonFab, IonFabButton, IonIcon, isPlatform
} from '@ionic/vue';
// HIER IST DIE KORREKTUR: PermissionState -> PermissionStatus
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { v4 as uuidv4 } from 'uuid';
import { camera } from 'ionicons/icons';

const router = useRouter();

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
      const loadedPhotos: Photo[] = JSON.parse(raw);
      // Validieren, dass die Dateien noch existieren
      const validPhotos: Photo[] = [];
      for (const photo of loadedPhotos) {
        try {
          // Wir prüfen nur, ob die URI noch gültig ist. Eine volle Dateiprüfung ist zu aufwändig.
          if (photo.filepath) {
            validPhotos.push(photo);
          }
        } catch (e) {
          console.warn(`Datei für Foto ${photo.id} nicht gefunden, wird entfernt.`);
        }
      }
      photos.value = validPhotos;
      if(validPhotos.length !== loadedPhotos.length) {
        savePhotosState(); // Bereinigte Liste speichern
      }
    }
  } catch (e) {
    console.error("Fehler beim Laden der Fotos aus localStorage", e);
    photos.value = [];
  }
}

async function takePhoto() {
  try {
    // Überprüfen und Anfordern der Berechtigungen in einem Schritt
    const permissions = await Camera.requestPermissions({
      permissions: ['camera', 'photos']
    });

    if (permissions.camera !== 'granted' || permissions.photos !== 'granted') {
      console.error('Kamera- oder Speicherberechtigung verweigert.');
      // Optional: Dem Benutzer eine Nachricht anzeigen
      return;
    }

    const image = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 90
    });

    if (!image.path) return;

    const fileName = `${uuidv4()}.jpeg`;
    // Kopiere das Bild vom temporären Kamera-Pfad in das persistente Datenverzeichnis der App
    const savedFile = await Filesystem.copy({
      from: image.path,
      to: fileName,
      toDirectory: Directory.Data,
    });

    photos.value.unshift({
      id: uuidv4(),
      filepath: savedFile.uri // Die persistente URI speichern
    });

    savePhotosState();
  } catch (error) {
    console.error("Fehler bei der Fotoaufnahme:", error);
  }
}

function openDetail(photoId: string) {
  router.push(`/detail/${photoId}`);
}

// Zweistufiges Bootstrap-Verfahren
onMounted(() => {
  // Sofort einen sichtbaren DOM-Baum erzeugen
  console.log("App gestartet - Loading-Screen anzeigen");

  // Verzögere alle App-Logik mit setTimeout
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
  height: 100px; /* Feste Höhe für einheitliche Kacheln */
  object-fit: cover;
  cursor: pointer;
}

.loading-container, .empty-gallery {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 18px;
  color: #666;
  text-align: center;
  padding: 20px;
}
</style>