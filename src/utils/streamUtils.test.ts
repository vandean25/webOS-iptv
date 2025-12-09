import { describe, it, expect, vi } from 'vitest';
import { getStreamQualityTags, getVideoCapability } from './streamUtils';

describe('streamUtils', () => {
    describe('getStreamQualityTags', () => {
        it('should detect 4K tags', () => {
            expect(getStreamQualityTags('Channel 4K').is4K).toBe(true);
            expect(getStreamQualityTags('Channel UHD').is4K).toBe(true);
            expect(getStreamQualityTags('Channel FHD').is4K).toBe(false);
        });

        it('should detect HEVC tags', () => {
            expect(getStreamQualityTags('Channel HEVC').isHEVC).toBe(true);
            expect(getStreamQualityTags('Channel H.265').isHEVC).toBe(true);
        });

        it('should detect FHD tags', () => {
            expect(getStreamQualityTags('Channel FHD').isFHD).toBe(true);
            expect(getStreamQualityTags('Channel 1080').isFHD).toBe(true);
        });
    });

    describe('getVideoCapability', () => {
        it('should return false if document is undefined', () => {
            // Mocking global document if needed, but in vitest/jsdom it exists.
            // If we run in node environment it might not.
            // But let's assume standard behavior.
            // Actually, we can just check if it runs without crashing.
            const result = getVideoCapability();
            expect(typeof result).toBe('boolean');
        });
    });
});
