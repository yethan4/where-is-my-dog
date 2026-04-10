# Where Is My Dog?

Mobile application helping reunite lost dogs with their owners in Lublin, Poland.

## About

**Where Is My Dog?** is a mobile platform connecting people who have lost their dogs with those who have found them. The app uses geolocation, intelligent matching, and notifications to maximize the chances of successful reunions.

The project is focused on the **Lublin area** with plans to expand to other Polish cities.

---

## 1. Features

### 1.1. For Users Who Found a Dog

1. Browse "lost dog" listings in radius R
2. Add "found dog" listing with photo, characteristics, and location
3. Update listing status:
   - Found (default, expires after 48h without update)
   - Temporarily fostered (under care until owner is found)
   - Returned to owner (listing closed)
   - Expired
4. System suggests similar existing listings to prevent duplicates
5. If confirmed as same dog, can add location to existing listing
   - New location is immediately visible in location history
   - All locations displayed chronologically with timestamps
   - Users can report suspicious location updates
6. Earn loyalty points for helping reunite dogs
7. Contact owners via in-app chat

### 1.2. For Users Who Lost a Dog

1. Add "lost dog" listing with photo, characteristics, and location/area
2. Update their listing
3. Browse "found dog" listings in radius R
4. Filter by dog characteristics
5. Receive notifications about new "found dog" listings matching their dog's characteristics
6. Confirm when dog is found (awards points to finder)
7. Contact finders via in-app chat

### 1.3. For Moderators

1. Delete inappropriate listings (with reason)
2. Block users (with reason)
3. Review user reports
4. View moderation history

### 1.4. System Features

1. Email verification for new accounts
2. User reporting system
3. Geolocation: GPS auto-detect or manual area selection
4. Smart duplicate detection algorithm (compares location, characteristics, timing)
5. Automatic listing expiration (48h for "found" status without update)
6. Photo limit: 2 photos per listing
7. Loyalty points system with local rankings
8. Future: ML model for dog matching

---

## 2. Planned Tech Stack

**Backend**
- Python 3.11+
- Django 5.x + Django REST Framework
- PostgreSQL 15 + PostGIS 3.3
- Redis 7 (cache, message broker)
- Celery (async tasks, notifications)

**Mobile**
- React Native 0.72+
- TypeScript
- React Navigation
- React Native Maps

**Infrastructure**
- Docker + Docker Compose
- AWS EC2 + RDS
- Cloudinary (photo storage and compression)
- Firebase Cloud Messaging (push notifications)

---

## 3. Documentation

Full documentation is available in the [docs/](docs/) folder.

---

## 4. License

This project is licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) — free for non-commercial use, learning, and viewing. Commercial use is not permitted.

---

## 5. Author

**Sebastian**
- GitHub: [@yethan](https://github.com/yethan4)