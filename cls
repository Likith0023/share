rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /files/{fileId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
