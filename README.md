# BullitenBoard
App where users and organizations had create free events. Users can also browse and mark themselves as attending an event.


### Member user story
1. Create account/Login
2. Option to browse existing events
&nbsp;* *Can filter by type (v2)* 
&nbsp;* Can mark themselves as attending
3. Can create their own events
&nbsp;* *Private or public (v2)*
4. Can request access to Orgs
5. Can remove themselves from Orgs
6. Requests Management
&nbsp;* Event Attendees
&nbsp;* Can see list of requests and accept or reject them

### Org user story
1. Created by Member
2. Option to add other Members to Org (admin or general member)
3. Can created Org events (if admin)
&nbsp;* Public, members only, or invite only events
4. Can access attendees list
&nbsp;* Can remove attendee
5. Requests Management
&nbsp;* Event Attendees
&nbsp;* Can see list of requests and accept or reject them
&nbsp;* Org Member 
&nbsp;* Can see list of requests and accept or reject them
6. Org Edit
&nbsp;* Can update details of Org
&nbsp;* Can remove or add members
&nbsp;* Can promote members to admin

## Model Layout

### Org
1. Name: String
2. profilePic: img file (multer)
3. Description: text
4. Requests: Array
&nbsp;* OrgRequest.ObjectId


## Member
1. FirstName: String
2. LastName: String
3. Email: String
4. aboutMe: String
5. *Friend: Member.ObjectId (v2)*
6. profilePic: img file (multer)
7. signUpDate: Date
8. Location: Object {addr 1, addr2, city, state, zip} -- API -- lat long
9. Birthday: date

## Event
1. Name: String
2. memberHost: Member.ObjectId
3. OrgHost: Org.ObjectId
4. dateTimeOfEvent: Date
5. endDateTime: Date 
6. eventPic: img file (multer)
7. Requests: Array
&nbsp;* AttendRequest.ObjectId
8. Description: text
9. *private: Boolean (v2)*
10. membersOnly: Boolean
11. attendeeMax: Number
12. Location: Object {addr 1, addr2, city, state, zip} -- API -- lat long
13. HasAlcohol: Boolean

## Request (by route)
1. Member: String
2. Message: String
3. Date: Date

## Membership
1. Member: Member.ObjectId
2. Admin: Boolean
3. Date of Membership: Date
4. Org: Org.ObjectId

## Attendance
1. Member: Member.ObjectId
2. signUpDate: Date
3. Event: Event.ObjectId
