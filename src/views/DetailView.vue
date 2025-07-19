<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonButton,
} from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { PhotoEditor } from '@capawesome/capacitor-photo-editor';
import { isPlatform, onIonViewWillEnter } from '@ionic/vue';
import { ref } from 'vue';

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

// Foto aus LocalStorage ziehen
const photo = ref(
    JSON.parse(localStorage.getItem('photos') || '[]').find((p: any) => p.id === id)
);

// beim Betreten neu laden, falls geändert
onIonViewWillEnter(() => {
  const fresh = JSON.parse(localStorage.getItem('photos') || '[]').find((p: any) => p.id === id);
  if (fresh) photo.value = fresh;
});

async function deletePhoto() {
  await Filesystem.deleteFile({ path: photo.value.filepath, directory: Directory.Data });
  const photos = JSON.parse(localStorage.getItem('photos') || '[]').filter((p: any) => p.id !== id);
  localStorage.setItem('photos', JSON.stringify(photos));
  router.back();
}

async function editPhoto() {
  if (!isPlatform('android')) return;

  // neue API ab v7
  await PhotoEditor.editPhoto({ path: photo.value.filepath });

  // geändertes Bild nach dem Speichern erneut laden
  const updated = JSON.parse(localStorage.getItem('photos') || '[]').find((p: any) => p.id === id);
  if (updated) photo.value = updated;
}
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start"><IonBackButton defaultHref="/" /></IonButtons>
        <IonTitle>Foto</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent class="ion-padding">
      <img :src="photo.webviewPath" style="width: 100%; border-radius: 8px;" />
      <div class="ion-text-center ion-margin-top">
        <IonButton expand="block" @click="editPhoto">Bearbeiten</IonButton>
        <IonButton color="danger" expand="block" @click="deletePhoto">Löschen</IonButton>
      </div>
    </IonContent>
  </IonPage>
</template>
