import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import queryString from 'query-string'
import { Card, CardBody } from 'reactstrap';
import { SlackButton } from '../components/buttons';

type PasswordResetPageProps = RouteComponentProps<{}>

const PasswordResetPage = ({
  location,
}: PasswordResetPageProps) => {
  const parsed = queryString.parse(location.search);

  if (parsed?.status === 'error' && typeof parsed?.message === 'string') {
    return (
      <Card>
        <CardBody>
          <h1 className="text-center">Error integrating Google Calendar</h1>
          <p>{parsed.message}</p>
        </CardBody>
      </Card>
    )
  } if (parsed?.status === 'success') {
    return (
      <Card>
        <CardBody>
          <h1 className="text-center">The Google Calendar integration was successful!</h1>
          <div className="text-center">
            <SlackButton />
          </div>
        </CardBody>
      </Card>
    )
  }
  return null
}

// @ts-ignore
export default PasswordResetPage
