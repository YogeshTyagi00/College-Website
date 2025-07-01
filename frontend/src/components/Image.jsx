const getImageForCategory = (category) => {

    const images = {

        'tech-festN': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
        'sportsN': 'https://images.unsplash.com/photo-1593013820725-ca0b6076576f?w=800&h=400&fit=crop',
        'academicN': 'https://images.unsplash.com/photo-1537495329792-41ae41ad3bf0?w=800&h=400&fit=crop',
        'campusN': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
        'eventN': 'https://plus.unsplash.com/premium_photo-1661306437817-8ab34be91e0c??w=800&h=400&fit=crop',

        'sportsS': 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800&h=400&fit=crop',
        'technicalS': 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop',
        'culturalS': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop',
        'businessS': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
        'creativeS': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop',
        'socialS': 'https://images.unsplash.com/photo-1532629391-a67b5f152f20?w=800&h=400&fit=crop',
        'academicS': 'https://images.unsplash.com/photo-1513258814515-d36c2e3612d3?w=800&h=400&fit=crop',

        'workshopE': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
        'seminarE': 'https://images.unsplash.com/photo-1593013820725-ca0b6076576f?w=800&h=400&fit=crop',
        'competitionE': 'https://images.unsplash.com/photo-1537495329792-41ae41ad3bf0?w=800&h=400&fit=crop',
        'sportsE': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
        'culturalE': 'https://plus.unsplash.com/premium_photo-1661306437817-8ab34be91e0c??w=800&h=400&fit=crop',
        'internshipE': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',

        'all': 'https://images.unsplash.com/photo-1478147493297-c0f5855d0124?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    };

    return images[category] || 'Image not found';

}

export default getImageForCategory