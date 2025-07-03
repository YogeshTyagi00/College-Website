const getImageForCategory = (category) => {

    const images = {

        'tech-festN': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
        'sportsN': 'https://images.unsplash.com/photo-1593013820725-ca0b6076576f?w=800&h=400&fit=crop',
        'academicN': 'https://images.unsplash.com/photo-1537495329792-41ae41ad3bf0?w=800&h=400&fit=crop',
        'campusN': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
        'eventN': 'https://plus.unsplash.com/premium_photo-1661306437817-8ab34be91e0c??w=800&h=400&fit=crop',

        'sportsS': 'https://images.unsplash.com/photo-1628779238951-be2c9f2a59f4?w=800&h=400&fit=crop',
        'technicalS': 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop',
        'culturalS': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop',
        'businessS': 'https://images.unsplash.com/photo-1534951009808-766178b47a4f?w=800&h=400&fit=crop',
        'creativeS': 'https://plus.unsplash.com/premium_photo-1681488007344-c75b0cf8b0cd?w=800&h=400&fit=crop',
        'socialS': 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=400&fit=crop',
        'academicS': 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&h=400&fit=crop',

        'workshopE': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
        'seminarE': 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=400&fit=crop',
        'competitionE': 'https://images.unsplash.com/photo-1537495329792-41ae41ad3bf0?w=800&h=400&fit=crop',
        'sportsE': 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&h=400&fit=crop',
        'culturalE': 'https://plus.unsplash.com/premium_photo-1661306437817-8ab34be91e0c??w=800&h=400&fit=crop',
        'internshipE': 'https://plus.unsplash.com/premium_photo-1727209458324-5d04d5e00cf4?w=800&h=400&fit=crop',

        'all': 'https://images.unsplash.com/photo-1478147493297-c0f5855d0124?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    };

    return images[category] || 'Image not found';

}

export default getImageForCategory