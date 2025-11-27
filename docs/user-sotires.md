# User Stories

## Overview
This document describes key user scenarios for the "Where Is My Dog?" application. Each story represents a realistic use case from the perspective of different user types.

**Legend:**
- 🔍 = Finder (user who found a dog)
- 😢 = Owner (user who lost a dog)
- 👮 = Moderator
- 🤖 = System automated action

---

## 1. Finding a Dog - With Duplicate Match 🔍

**Actor:** Bob (finder)  
**Goal:** Report a found dog that matches an existing listing  
**Type:** Happy path with system matching

### Preconditions
- Bob has a verified account (email confirmed)
- Bob has location services enabled
- At least one similar "lost dog" listing exists in the area

### Main Scenario

1. Bob sees a lonely dog in his neighborhood
2. Bob opens the application
3. Bob clicks "I Found a Dog"
4. Bob takes a photo of the dog
5. Bob fills in dog characteristics:
   - Breed (or mixed)
   - Size (small/medium/large)
   - Color
   - Gender (if identifiable)
   - Collar (yes/no, color if present)
6. Bob sets location:
   - Option A: System automatically uses GPS
   - Option B: Bob manually pins location on map
7. Bob clicks "Next"
8. 🤖 System searches for similar listings within configurable radius (default 5km)
9. 🤖 System finds multiple similar listings and presents them to Bob: "Could this be one of these dogs?"
10. Bob reviews first suggested listing → clicks "No, different dog"
11. Bob sees second listing that matches → clicks "Yes, same dog"
12. System asks for confirmation: "Are you sure this is the same dog?"
13. Bob confirms: "Yes, I'm certain"
14. 🤖 System updates the existing listing by adding new location to location history
15. Bob sees confirmation message: "Listing updated successfully"
16. Bob can see "Report Mistake" button (available for 1 hour)
17. 🤖 Bob earns loyalty points for location update
18. 🤖 Original poster receives push notification: "New location update for your listing"

### Alternative Scenarios

**9a. No similar listings found:**
- System proceeds to create new listing immediately
- Skip steps 10-14

**13a. Bob cancels confirmation:**
- System asks: "Would you like to create a new listing instead?"
- If yes → create new listing
- If no → return to step 9

**14a. Bob reports mistake (within 1h):**
- System flags location update for review
- Moderator receives notification
- Location update marked as "disputed"

### Postconditions
- Existing listing updated with new location entry
- Location history shows: timestamp, coordinates, Bob's username, Bob's trust level
- Loyalty points awarded to Bob
- Push notification sent to original poster
- Bob's contribution recorded in system

### Data Requirements
- Photo file (JPEG/PNG, max 5MB, uploaded to Cloudinary)
- GPS coordinates (latitude, longitude) or manual location
- Timestamp (UTC)
- Dog characteristics structured data
- User ID and trust level
- Device info (for anti-spam)

---

## 2. Lost Dog - Receives Notification and Successful Reunion 😢

**Actor:** Alice (owner who lost her dog)  
**Goal:** Find her lost dog using the app  
**Type:** Complete journey from posting to reunion

### Preconditions
- Alice has a verified account
- Alice has photo of her dog
- Alice has notifications enabled

### Main Scenario

1. Alice doesn't notice her dog escaped through ground floor and ran away
2. Alice realizes dog is missing and opens the application
3. Alice sets search area:
   - Option A: Uses current GPS location
   - Option B: Manually selects area on map where dog was last seen
   - Sets search radius (e.g., 1km)
4. Alice fills in her dog's characteristics to filter results
5. Alice browses "found dog" listings in her specified radius
6. Alice doesn't find her dog among current listings
7. Alice clicks "My Dog Is Lost"
8. Alice uploads photo of her dog
9. Alice fills in detailed characteristics
10. Alice marks approximate area where dog went missing
11. Alice publishes the "lost dog" listing
12. **[2 hours later]**
13. Alice receives push notification: "A dog matching your description was found 2km away by user Robert"
14. Alice opens the notification and sees Robert's listing
15. Alice recognizes her dog in the photo
16. Alice clicks "Start Chat" with Robert
17. Alice writes: "This is my dog! I'm on my way. Could you please keep him safe?"
18. Robert replies: "Sure, I'll wait here"
19. Alice drives to the location
20. Alice is reunited with her dog
21. Alice clicks on Robert's listing: "I found my dog thanks to this listing"
22. System asks for photo confirmation
23. Alice takes and uploads photo of the reunion
24. 🤖 System sends confirmation request to Robert with Alice's photo
25. Robert receives notification: "Alice claims she found her dog. Please confirm:"
26. Robert sees the photo and clicks "Confirm - Yes, this is the dog"
27. 🤖 System closes both listings:
    - Robert's listing → status: "Returned to owner"
    - Alice's listing → status: "Found"
28. 🤖 Robert earns loyalty points for helping reunite dog with owner
29. 🤖 System records successful reunion in statistics

### Alternative Scenarios

**6a. Alice finds her dog in existing listings:**
- Alice contacts finder immediately via chat
- Skip steps 7-12

**17a. Robert doesn't respond to chat:**
- Alice can call emergency contact (if provided)
- Alice can report unresponsive finder
- System flags Robert for review

**26a. Robert denies confirmation:**
- System opens dispute resolution
- Both parties can submit evidence
- Moderator reviews case
- No points awarded until resolved

**26b. Robert doesn't respond within 24h:**
- System auto-confirms if Alice provided clear photo evidence
- Robert receives warning about responsiveness

### Postconditions
- Both listings closed with "successful reunion" status
- Loyalty points awarded to Robert
- Chat conversation archived
- Reunion photo stored for records
- Success case added to app statistics
- Both users can leave optional feedback

### Data Requirements
- Alice's listing: photo, characteristics, area, timestamp
- Robert's listing: photo, location, timestamp
- Chat messages (encrypted)
- Reunion confirmation photo
- GPS coordinates of reunion (optional)
- Confirmation timestamps

---

## 3. Temporarily Fostering a Found Dog 🔍

**Actor:** Monika (finder who can foster temporarily)  
**Goal:** Report found dog and provide temporary shelter  
**Type:** Extended care scenario

### Preconditions
- Monika has verified account
- Monika can provide temporary shelter
- Dog is safe to transport

### Main Scenario

1. Monika encounters an unknown dog on her way home
2. Monika opens the application
3. Monika clicks "I Found a Dog"
4. Monika takes photo of the dog
5. Monika fills in characteristics
6. Monika sets location where dog was found (GPS or manual)
7. Monika clicks "Next"
8. 🤖 System searches for similar listings in area
9. 🤖 System finds several similar listings
10. System asks: "Could this be one of these dogs?"
11. Monika reviews each suggestion
12. Monika rejects all suggestions: "No, none of these match"
13. System proceeds with new listing creation
14. Monika selects listing status: "Temporarily Fostered"
15. Monika adds note: "I took the dog home for safety. Available at ul. Kwiatowa 15"
16. Monika can optionally add:
    - Available hours for pickup
    - Contact preferences (chat only / phone OK)
17. Monika publishes the listing
18. Monika closes app and takes dog home
19. **[8 hours later]**
20. Monika receives chat message from Maks
21. Maks writes: "This is my dog! Thank you so much for taking care of him"
22. They arrange pickup time and location
23. Maks picks up his dog
24. Monika updates listing: "Dog returned to owner"
25. System asks for optional photo confirmation
26. Monika uploads photo of handover
27. 🤖 Maks receives confirmation request
28. Maks confirms reunion
29. 🤖 Monika earns loyalty points:
    - Points for finding
    - Bonus points for temporary fostering
30. 🤖 System closes listing with status "Returned to owner"

### Alternative Scenarios

**14a. Monika cannot foster:**
- Monika selects status: "Found" (default)
- Monika adds note about dog's current location
- Someone else might take over care

**20a. Multiple people claim ownership:**
- Monika asks for proof (photos, vet records, dog's behavior)
- If dispute continues → moderator intervention
- Monika can mark listing as "disputed"

**23a. Owner cannot pick up immediately:**
- Monika can update "Available for pickup" hours
- Chat remains open for coordination
- Listing stays in "Temporarily Fostered" status

### Postconditions
- Listing closed successfully
- Loyalty points (including fostering bonus) awarded
- Optional photo documentation stored
- Monika's profile shows "helped reunite X dogs"
- Success story recorded

### Data Requirements
- Found location (GPS coordinates)
- Fostering location (address - optional, can be approximate)
- Availability hours
- Contact preferences
- Photo of dog
- Characteristics
- Chat logs
- Confirmation photo (optional)
- Timestamps for all status changes

---

## 4. Finding Dog Via Location Trail 😢

**Actor:** Adam (owner searching for his lost dog)  
**Goal:** Use location history to find dog  
**Type:** Multi-location tracking scenario

### Preconditions
- Adam previously posted "lost dog" listing (background info)
- Multiple users reported same dog at different locations
- Adam has notifications enabled (but may have missed them)

### Main Scenario

1. Adam opens the application
2. Adam browses "found dog" listings with filters matching his dog's characteristics
3. Adam sees a listing that matches his dog
4. Listing shows location trail with multiple updates:
   - Location 1: Park Saski (12:00) - reported by User A
   - Location 2: Park Ludowy (14:30) - reported by User B  
   - Location 3: ul. Długa 15 (16:00) - reported by User C ⭐ (most recent)
5. Adam sees most recent location is only 2 hours old
6. Adam decides to check the latest location first
7. Adam drives to ul. Długa 15
8. Adam finds his dog is still there
9. Adam takes his dog
10. Adam clicks on the listing: "This is my dog! I found him thanks to this listing"
11. System asks for photo confirmation
12. Adam takes photo of himself with the dog
13. Adam uploads confirmation photo
14. 🤖 System identifies original poster (User C who last reported location)
15. 🤖 User C receives notification: "Adam claims he found his dog. Please confirm:"
16. User C sees Adam's photo
17. User C clicks "Confirm - Yes, that's the dog I reported"
18. 🤖 System closes the listing with status "Returned to owner"
19. 🤖 System awards loyalty points to all contributors:
    - User A: points for first sighting
    - User B: points for location update
    - User C: full points for successful reunion
20. 🤖 If Adam had a "lost dog" listing, system automatically closes it too
21. Adam can optionally thank contributors via automated message

### Alternative Scenarios

**7a. Dog not at latest location:**
- Adam checks previous locations in reverse chronological order
- Adam can add comment: "Dog no longer at ul. Długa 15 as of [time]"
- Other searchers see updated info

**10a. Adam didn't have prior listing:**
- System still allows claiming
- Adam must provide extra verification (detailed description, vet records)
- Moderator may review case

**17a. User C cannot confirm (offline/unavailable):**
- System waits 24h for response
- If Adam provided clear photo evidence → auto-confirm
- If uncertain → flag for moderator review

**20a. Multiple "lost dog" listings match:**
- System asks Adam to confirm which listing was his
- System links reunion to correct original listing

### Postconditions
- Found listing closed
- Adam's lost listing (if exists) closed
- All contributors receive loyalty points (graduated based on contribution)
- Location trail preserved in archives
- Success metrics updated
- Optional thank-you messages sent to contributors

### Data Requirements
- Complete location trail:
  - GPS coordinates for each location
  - Timestamp for each sighting
  - User ID for each reporter
  - Trust level for each reporter
- Confirmation photo
- Original "lost dog" listing ID (if exists)
- Contributors list
- Verification data

---

## 5. Reporting Inappropriate Content 👮

**Actor:** User Y (reporter), Moderator (reviewer)  
**Goal:** Remove inappropriate listing from platform  
**Type:** Content moderation workflow

### Preconditions
- User X posted inappropriate listing
- User Y has verified account
- Moderator is available

### Main Scenario

1. User X creates listing with offensive photo
2. User Y sees this listing while browsing
3. User Y clicks three-dot menu → "Report"
4. System shows report reasons:
   - Spam
   - Offensive content
   - Fake listing
   - Duplicate
   - Other (with text field)
5. User Y selects "Offensive content"
6. User Y optionally adds explanation
7. User Y submits report
8. 🤖 System records report
9. 🤖 System checks if listing has reached report threshold (e.g., 3 reports)
10. **[After 3rd report]**
11. 🤖 System automatically hides listing from public view
12. 🤖 System notifies moderator team
13. Moderator opens moderation panel
14. Moderator reviews:
    - Listing content (photos, description)
    - All reports and reasons
    - User X's history
15. Moderator decides: "Delete listing"
16. Moderator selects deletion reason: "Offensive photo"
17. Moderator can add notes for records
18. 🤖 System permanently removes listing
19. 🤖 User X receives notification: "Your listing was removed. Reason: Offensive photo. Warning 1/3"
20. 🤖 If User X reaches 3 warnings → automatic account suspension
21. Reporters (including User Y) receive notification: "Thank you. The listing you reported has been removed"

### Alternative Scenarios

**15a. Moderator decides listing is acceptable:**
- Moderator clicks "Dismiss reports"
- Listing becomes public again
- Reporters notified: "Report reviewed - no violation found"
- No penalty for reporters (good faith reporting)

**15b. Moderator cannot decide:**
- Moderator escalates to senior moderator
- Listing remains hidden during review
- All parties notified of extended review time

**18a. False reporting detected:**
- If User Y repeatedly reports valid listings
- Moderator can flag User Y
- After review, User Y may receive warning
- Repeat false reporters can be suspended

### Postconditions
- Inappropriate listing removed
- User X warned (strike on account)
- Reports resolved and archived
- Reporters thanked
- Moderation action logged
- Statistics updated

### Data Requirements
- Report data: reporter ID, reason, timestamp, optional notes
- Listing data: all photos, text, user info
- User X history: previous warnings, past listings
- Moderator ID and decision
- Timestamps for all actions
- Appeal period tracking (if implemented)

---

## 6. Automatic Listing Expiration 🤖

**Actor:** System (automated), Bob (listing owner)  
**Goal:** Keep listings current and relevant  
**Type:** Automated maintenance workflow

### Preconditions
- Bob created "found dog" listing with status "Found"
- 48 hours have passed without any update
- Bob has push notifications enabled

### Main Scenario

1. Bob creates "found dog" listing (status: Found)
2. Bob does not update the listing
3. **[47 hours later]**
4. 🤖 System sends reminder notification to Bob: "Your listing expires in 1 hour. Is the dog still with you?"
5. Bob doesn't respond to notification
6. **[48 hours after creation]**
7. 🤖 System automatically changes listing status to "Expired"
8. 🤖 Listing remains visible but marked with "⚠️ Expired" badge
9. 🤖 Bob receives notification: "Your listing expired. Is the dog still in your care?"
10. Notification includes quick actions:
    - "Extend - Dog still here"
    - "Close - Dog found owner"
    - "Update status"
11. **[Bob opens app]**
12. Bob sees notification
13. Bob clicks "Extend - Dog still here"
14. System asks: "Any updates on the dog's location or status?"
15. Bob can optionally:
    - Update location
    - Change status to "Temporarily Fostered"
    - Add notes
16. Bob clicks "Update and Extend"
17. 🤖 System changes status back to "Found"
18. 🤖 Listing gets fresh 48-hour timer
19. 🤖 Expiration badge removed
20. Users searching can see listing is actively maintained

### Alternative Scenarios

**13a. Bob clicks "Close - Dog found owner":**
- System asks for optional details
- Listing closed with status "Returned to owner"
- No more expiration checks

**13b. Bob doesn't respond:**
- After 7 days expired → listing auto-archived
- Archived listings not shown in searches
- Bob can still reactivate from profile

**5a. Bob updates listing before expiration:**
- Timer resets to 48 hours
- No expiration warning sent
- Normal flow continues

### Postconditions
- Listing either:
  - Extended with fresh timer, OR
  - Closed successfully, OR
  - Archived (if abandoned)
- Database updated
- Search index refreshed
- Users see current, relevant listings

### Data Requirements
- Listing creation timestamp
- Last update timestamp
- Listing status
- Expiration timer value (configurable)
- Notification delivery status
- User response/action

---

## 7. Filtering and Searching 🔍

**Actor:** Alice (searching for specific dog)  
**Goal:** Find listings matching specific criteria  
**Type:** Search and filter workflow

### Preconditions
- Alice has verified account
- Multiple listings exist in database
- Alice knows specific characteristics of dog she's looking for

### Main Scenario

1. Alice opens application
2. Alice navigates to "Browse Listings"
3. System shows default view:
   - All "found dog" listings
   - Within 5km radius of Alice's location
   - Sorted by most recent
4. Alice sees 50+ listings (overwhelming)
5. Alice clicks "Filters" button
6. System shows filter options:
   - **Radius:** 1km / 5km / 10km / 20km / All
   - **Breed:** Dropdown with common breeds + "Mixed" + "Unknown"
   - **Size:** Small / Medium / Large
   - **Color:** Multiple select (Black, Brown, White, Golden, Gray, Multi-color)
   - **Collar:** Yes / No / Unknown
   - **Status:** Found / Temporarily Fostered / All
7. Alice selects filters:
   - Breed: German Shepherd
   - Size: Large
   - Color: Black
   - Radius: 10km
8. Alice clicks "Apply Filters"
9. 🤖 System searches database with criteria
10. 🤖 System returns 3 matching listings
11. Alice sees filtered results with:
    - Photo thumbnails
    - Distance from her location
    - Time posted
    - Match percentage (how many criteria matched)
12. Alice can sort results by:
    - Distance (nearest first)
    - Time (newest first)
    - Match percentage (best match first)
13. Alice browses the 3 listings
14. Alice clicks on one to see details
15. Alice can "Save" listing to favorites
16. Alice can clear filters and start over

### Alternative Scenarios

**10a. No results match filters:**
- System shows: "No listings match your filters"
- System suggests: "Try expanding radius or removing some filters"
- Alice can click "Expand radius by 5km"

**10b. Too many results:**
- System suggests adding more filters
- Alice can enable "Show exact matches only"

**5a. Alice uses text search:**
- Alice types in search bar: "golden retriever collar"
- System searches in listing descriptions and characteristics
- Results shown with relevance score

**15a. Alice wants notifications for criteria:**
- Alice clicks "Save search"
- System: "Get notified when new listings match these filters?"
- Alice enables notifications
- Future listings matching criteria trigger push notifications

### Postconditions
- Search query logged (for system improvement)
- Results displayed based on criteria
- Alice can refine or save search
- Saved searches can trigger future notifications

### Data Requirements
- User location (GPS)
- Filter criteria values
- Listing database with indexed characteristics
- Distance calculations (PostGIS)
- Search preferences (saved)
- Notification settings

---

## Additional Scenarios (Future Consideration)

### 8. Chat Communication
- Real-time messaging between finder and owner
- Photo sharing in chat
- Location sharing (optional)
- Message encryption

### 9. Loyalty Points and Rankings
- User views their points
- User views local leaderboard
- Badges and achievements
- Point redemption (future feature)

### 10. Account Management
- Email verification flow
- Password reset
- Profile editing
- Notification preferences
- Account deletion

---

## Notes for Implementation

### Key Insights from User Stories:

1. **Verification is crucial:** Photo confirmations prevent fraud
2. **Timeouts matter:** 48h expiration, 1h mistake reporting, 24h confirmation windows
3. **Multi-step confirmations:** Prevent accidental or malicious actions
4. **Notifications are central:** Users need real-time updates
5. **Trust indicators:** User history and points build community trust
6. **Flexibility in locations:** GPS auto-detect + manual override
7. **Clear status transitions:** Each listing has well-defined lifecycle
8. **Moderator oversight:** Balance automation with human review

### Data Patterns Identified:

- Listings have multiple states and lifecycle
- Location history is append-only
- Confirmations require two-party agreement
- Points are awarded only after verification
- Chat is ancillary but important
- Reports trigger automated + manual review

---

## Changelog

- **2025-11-27:** Initial user stories documented based on planning session