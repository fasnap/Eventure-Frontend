import React from 'react'
import Header from '../../components/shared/Header'
import AttendeeProfile from '../../components/attendee/AttendeeProfile'
import AttendeeSidebar from '../../components/shared/attendee/AttendeeSidebar'

function AttendeeProfilePage() {
  return (
    <div>
      <Header />
      <AttendeeSidebar />
      <AttendeeProfile />
    </div>
  )
}

export default AttendeeProfilePage
