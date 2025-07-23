<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton default-href="/"></IonBackButton>
        </IonButtons>
        <IonTitle>Detail</IonTitle>
        <IonButtons slot="end">
          <IonButton @click="editPhoto">Bearbeiten</IonButton>
          <IonButton color="danger" @click="deletePhoto">Löschen</IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonImg v-if="photoSrc" :src="photoSrc" />
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonImg,
  IonBackButton
} from '@ionic/vue';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { PhotoEditor } from '@capawesome/capacitor-photo-editor';

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;
const photoSrc = ref<string>('');
let nativePhotoPath = '';
let photoFileName = '';

async function loadPhoto() {
  const list = JSON.parse(localStorage.getItem('photos') || '[]');
  const photo = list.find((p: any) => p.id === id);

  if (photo && photo.filepath) {
    nativePhotoPath = photo.filepath;
    photoFileName = nativePhotoPath.substring(nativePhotoPath.lastIndexOf('/') + 1);
    photoSrc.value = Capacitor.convertFileSrc(nativePhotoPath);
  } else {
    console.error('Foto nicht gefunden!');
    router.push('/');
  }
}

async function deletePhoto() {
  if (!photoFileName) return;

  try {
    await Filesystem.deleteFile({
      path: photoFileName,
      directory: Directory.Data,
    });

    let list = JSON.parse(localStorage.getItem('photos') || '[]');
    list = list.filter((p: any) => p.id !== id);
    localStorage.setItem('photos', JSON.stringify(list));

    // Nach dem Löschen zur Startseite navigieren.
    router.push('/');
  } catch (error) {
    console.error("Fehler beim Löschen des Fotos:", error);
  }
}

async function editPhoto() {
  if (!nativePhotoPath) return;

  try {
    await PhotoEditor.editPhoto({
      path: nativePhotoPath,
    });
    photoSrc.value = Capacitor.convertFileSrc(nativePhotoPath) + '?t=' + new Date().getTime();
  } catch (error) {
    console.error("Fehler beim Bearbeiten des Fotos:", error);
  }
}

onMounted(loadPhoto);
</script>