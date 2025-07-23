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
  IonImg, IonFab, IonFabButton, IonIcon, isPlatform, onIonViewWillEnter
} from '@ionic/vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { v4 as uuidv4 } from 'uuid';
import { camera } from 'ionicons/icons';

const router = useRouter();
const appReady = ref(false);
const photos = ref<Photo[]>([]);

interface Photo {
  id: string;
  filepath: string;
  webviewPath?: string;
}

function getPhotoSrc(filepath: string): string {
  return Capacitor.convertFileSrc(filepath);
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
    const permissions = await Camera.requestPermissions({
      permissions: ['camera', 'photos']
    });

    if (permissions.camera !== 'granted' || permissions.photos !== 'granted') {
      console.error('Kamera- oder Speicherberechtigung verweigert.');
      return;
    }

    const image = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 90,
    });

    if (!image.webPath || !image.path) return;

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

function openDetail(photoId: string) {
  router.push(`/detail/${photoId}`);
}

onIonViewWillEnter(() => {
  loadPhotos();
});

onMounted(() => {
  loadPhotos().then(() => {
    appReady.value = true;
  });
});
</script>

<style scoped>
ion-img {
  width: 100%;
  height: 100px;
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