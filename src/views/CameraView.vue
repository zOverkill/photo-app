<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Kamera</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$router.push('/')">
            Abbrechen
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-camera @take-picture="takePicture"></ion-camera>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { useStorage } from '@vueuse/core';

export default defineComponent({
  name: 'CameraView',
  setup() {
    const photos = useStorage('photos', []);

    const takePicture = async () => {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          width: 800,
          height: 600,
          format: 'jpeg',
          correctOrientation: true,
          source: 'camera'
        });

        // Speichern der Bild-URL im Dateisystem
        const base64Data = image.base64Data;
        const fileName = `photo_${Date.now()}.jpeg`;
        const filePath = await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Filesystem.Directory.Pictures
        });

        // Speichern der Bildinformationen im lokalen Speicher
        const newPhoto = {
          id: Date.now(),
          src: filePath.uri,
          title: `Foto ${Date.now()}`,
          date: new Date()
        };

        photos.value.push(newPhoto);

        // Zurück zur Galerie
        this.$router.push('/');
      } catch (error) {
        console.error('Fehler beim Aufnehmen des Bildes:', error);
      }
    };

    return {
      takePicture,
      photos
    };
  }
});
</script>