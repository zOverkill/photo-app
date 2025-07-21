import {createRouter, createWebHistory} from 'vue-router';
import DetailView from '@/views/DetailView.vue';
import HomePageView from "@/views/HomePageView.vue";

const routes = [
    {
      path: '/',
      name: 'Home',
      component: HomePageView
    },
    {
      path: '/detail/:id',
      name: 'Detail', props: true,
      component: DetailView
    },

];

export default createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});