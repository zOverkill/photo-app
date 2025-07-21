<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Detail</IonTitle>
        <IonButtons slot="end">
          <IonButton @click="editPhoto">Bearbeiten</IonButton>
          <IonButton color="danger" @click="deletePhoto">Löschen</IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonImg :src="photoSrc" />
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonImg } from '@ionic/vue';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { PhotoEditor } from '@capawesome/capacitor-photo-editor';

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;
const photoSrc = ref<string>('');
let filepath = '';

async function loadPhoto() {
  const list = JSON.parse(localStorage.getItem('photos') || '[]');
  const photo = list.find((p: any) => p.id === id);
  filepath = photo.filepath;
  const uri = await Filesystem.getUri({ path: filepath, directory: Directory.Data });
  photoSrc.value = uri.uri;
}

async function deletePhoto() {
  await Filesystem.deleteFile({ path: filepath, directory: Directory.Data });
  let list = JSON.parse(localStorage.getItem('photos') || '[]');
  list = list.filter((p: any) => p.id !== id);
  localStorage.setItem('photos', JSON.stringify(list));
  router.push('/');
}

async function editPhoto() {
  const uri = (await Filesystem.getUri({ path: filepath, directory: Directory.Data })).uri;
  await PhotoEditor.editPhoto({
    path: uri,
  });
  // ggf. neues Bild überschreiben oder aktualisieren
  await loadPhoto();
}

onMounted(loadPhoto);
</script>