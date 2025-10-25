import React from 'react'
import Field from './Field'

const PersonalInformation = ({user, healthData, isFetching}) => {
  return (
    <div className="p-4 shadow-lg border-neutral-300 rounded-lg mt-3">
        <h2 className="text-lg font-medium mb-3">Personal</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field isFetching={isFetching} title="Name" text={healthData?.fullName} />
          <Field isFetching={isFetching} title="Email" text={user?.email} />
          <Field isFetching={isFetching} title="Age" text={healthData?.age} />
          <Field isFetching={isFetching} title="Phone" text={healthData?.phone} />
          <Field isFetching={isFetching} title="Gender" text={healthData?.gender} />
        </div>
      </div>
  )
}

export default PersonalInformation
