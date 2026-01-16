import { NextResponse } from 'next/server';
import { iconMetadata, iconCategories } from '@/lib/iconMap';

export async function GET() {
    try {
        const icons = iconMetadata.map(({ name, displayName, category }) => ({
            name,
            displayName,
            category
        }));

        return NextResponse.json({
            icons,
            categories: iconCategories
        });
    } catch (error) {
        console.error('Error fetching icons:', error);
        return NextResponse.json(
            { error: 'Failed to fetch icons' },
            { status: 500 }
        );
    }
}
