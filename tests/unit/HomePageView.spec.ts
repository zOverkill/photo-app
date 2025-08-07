import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HomePageView from '@/views/HomePageView.vue';
import { IonicVue } from '@ionic/vue';


vi.mock('@capacitor/camera', () => ({
    Camera: {
        requestPermissions: vi.fn().mockResolvedValue({ camera: 'granted', photos: 'granted' }),
        getPhoto: vi.fn().mockResolvedValue({
            webPath: 'fake-path.jpg',
            path: 'internal/fake-path.jpg',
        }),
    },
    CameraResultType: { Uri: 'uri' },
    CameraSource: { Camera: 'CAMERA' },
}));

vi.mock('@capacitor/filesystem', () => ({
    Filesystem: {
        copy: vi.fn().mockResolvedValue({ uri: 'file:///data/user/0/com.example.photoapp/files/new-photo.jpeg' }),
    },
    Directory: { Data: 'DATA' },
}));

vi.mock('@capacitor/core', () => ({
    Capacitor: {
        convertFileSrc: (path: string) => `converted_path_for_${path}`,
        isPlatform: () => true,
    },
}));

const mockRouter = {
    push: vi.fn(),
};

vi.mock('vue-router', () => ({
    useRouter: () => mockRouter,
}));


describe('HomePageView.vue', () => {
    let localStorageMock: Record<string, string> = {};

    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock = {};
        vi.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation((...args: unknown[]) => {
            const key = args[0] as string;
            const value = args[1] as string;
            localStorageMock[key] = value;
        });
        vi.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((...args: unknown[]) => {
            const key = args[0] as string;
            return localStorageMock[key];
        });
    });

    it('renders the title "Fotos"', () => {
        const wrapper = mount(HomePageView, {
            global: {
                plugins: [IonicVue],
            },
        });
        expect(wrapper.find('ion-title.home-title').text()).toBe('Fotos');
    });

    it('shows loading message initially', () => {
        const wrapper = mount(HomePageView);
        expect(wrapper.find('.loading-container').exists()).toBe(true);
    });

    it('loads photos from localStorage on mount', async () => {
        const mockPhotos = [{ id: '1', filepath: 'path/to/photo1.jpg', createdAt: Date.now() }];
        localStorageMock['photos'] = JSON.stringify(mockPhotos);

        const wrapper = mount(HomePageView);
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(wrapper.vm.photos.length).toBe(1);
        expect(wrapper.vm.photos[0].id).toBe('1');
    });

});