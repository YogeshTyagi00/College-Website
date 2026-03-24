const getImageForCategory = (category) => {

    // Direct Unsplash photo URLs — permanent, no auth needed
    const images = {
        // News categories
        'tech-festE': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
        'sportsE':    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
        'academicE':  'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&h=400&fit=crop',
        'campusE':    'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&h=400&fit=crop',
        'eventE':     'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',

        // Legacy N suffix
        'tech-festN': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
        'sportsN':    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
        'academicN':  'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&h=400&fit=crop',
        'campusN':    'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&h=400&fit=crop',
        'eventN':     'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',

        // Society categories
        'sportsS':    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
        'technicalS': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop',
        'culturalS':  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=400&fit=crop',
        'businessS':  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=400&fit=crop',
        'creativeS':  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=400&fit=crop',
        'socialS':    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=400&fit=crop',
        'academicS':  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop',

        // Event categories
        'workshopE':    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop',
        'seminarE':     'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=400&fit=crop',
        'competitionE': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=400&fit=crop',
        'culturalE':    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=400&fit=crop',
        'internshipE':  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=400&fit=crop',

        'all': 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&h=400&fit=crop',
    };

    return images[category] || 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&h=400&fit=crop';
}

export default getImageForCategory