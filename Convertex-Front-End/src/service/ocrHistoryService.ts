export interface OcrHistoryItem {
    id: string;
    fileName: string;
    format: string;
    textPreview: string;
    fullText: string;
    timestamp: string;
    fileUrl?: string;
}

const STORAGE_KEY = '@ocr_app:recent_files';
const MAX_HISTORY_ITEMS = 6;

export const ocrHistoryService = {
    getRecentFiles(): OcrHistoryItem[] {
        try {
            const data = sessionStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Erro ao ler histórico do sessionStorage:', error);
            return [];
        }
    },

    addRecentFile(newItem: Omit<OcrHistoryItem, 'id' | 'timestamp'>): OcrHistoryItem[] {
        const currentList = this.getRecentFiles();

        const createdItem: OcrHistoryItem = {
            ...newItem,
            id: crypto.randomUUID(),
            timestamp: new Date().toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
            }),
        };

        const updatedList = [createdItem, ...currentList].slice(0, MAX_HISTORY_ITEMS);

        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
        } catch (error) {
            console.error('Erro ao salvar no sessionStorage:', error);
        }

        return updatedList;
    },

    clearHistory(): void {
        sessionStorage.removeItem(STORAGE_KEY); // Corrigido de localStorage para sessionStorage
    }
};
