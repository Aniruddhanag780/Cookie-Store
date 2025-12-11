'use server';

import { doc, setDoc, getDoc, Firestore } from 'firebase/firestore';

export async function seedInitialData(db: Firestore) {
  const heroBannerRef = doc(db, 'Image', 'Hero Banner');
  const heroBannerSnap = await getDoc(heroBannerRef);

  if (!heroBannerSnap.exists()) {
    console.log('Seeding initial hero banner image...');
    await setDoc(heroBannerRef, {
      id: 'hero-banner',
      description: 'A beautiful banner of sweet cookies.',
      imageUrl: 'https://i.ibb.co/SVSGq6h/image.png',
      imageHint: 'cookies banner'
    });
    return true;
  }
  return false;
}
