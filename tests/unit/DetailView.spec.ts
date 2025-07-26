import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DetailView from '@/views/DetailView.vue';
import { IonicVue } from '@ionic/vue';

// ... (Mocks bleiben unverändert) ...
vi.mock('@capacitor/filesystem', () => ({
    Filesystem: {
        deleteFile: vi.fn().mockResolvedValue(undefined),
    },
    Directory: { Data: 'DATA' },
}));

vi.mock('@capacitor/core', () => ({
    Capacitor: {
        convertFileSrc: (path: string) => `converted_path_for_${path}`,
    },
}));

vi.mock('@capawesome/capacitor-photo-editor', () => ({
    PhotoEditor: {
        editPhoto: vi.fn().mockResolvedValue(undefined),
    },
}));

const mockRouter = {
    push: vi.fn(),
};
const mockRoute = {
    params: { id: '1' },
};

vi.mock('vue-router', () => ({
    useRouter: () => mockRouter,
    useRoute: () => mockRoute,
}));

describe('DetailView.vue', () => {
    let localStorageMock: Record<string, string> = {};

    beforeEach(() => {
        vi.clearAllMocks();
        const mockPhotos = [
            { id: '1', filepath: 'file:///path/to/photo1.jpeg', createdAt: new Date('2025-07-24T10:30:00Z').getTime() },
        ];
        localStorageMock = { photos: JSON.stringify(mockPhotos) };

        // ANPASSUNG: Generische Signatur und Typ-Zusicherung innerhalb der Funktion
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

    it('displays formatted date and time from photo metadata', async () => {
        const wrapper = mount(DetailView);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('.date').text()).toBe('24. Juli 2025');
        expect(wrapper.find('.time').text()).toBe('12:30 Uhr');
    });

    it('calls editPhoto on edit button click', async () => {
        const wrapper = mount(DetailView);
        await wrapper.vm.$nextTick();

        const editButton = wrapper.findAll('ion-button')[0];
        await editButton.trigger('click');

        const { PhotoEditor } = await import('@capawesome/capacitor-photo-editor');
        expect(PhotoEditor.editPhoto).toHaveBeenCalledWith({
            path: 'file:///path/to/photo1.jpeg',
        });
    });
});