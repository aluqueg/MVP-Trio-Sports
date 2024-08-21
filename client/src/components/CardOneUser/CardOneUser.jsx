import React from 'react'
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container'
import {format} from 'date-fns'

export const CardOneUser = ({data}) => {
  let userBirthDate = parseInt(data.birth_date)
  let today = parseInt(format(new Date(), "yyyy-MM-dd"))
  let age = today - userBirthDate;  
  
  return (
    <Container className='justify-content-center align-content-center'>
    <Card className='rounded-4' style={{ width: '18rem' }}>
      <Card.Img variant="top" src={data.user_img} />
      <Card.Body>
        <Card.Title>{data?.user_name}  {data?.last_name}</Card.Title>
        <Card.Text>
          {age} años - {data?.gender}
        </Card.Text>
        <Card.Text>
          {data?.user_city}
        </Card.Text>
        <Card.Text>
          {data?.sports}
        </Card.Text>
        <Card.Text>
          {data.practice}
        </Card.Text>
        <Card.Text>
          {data?.description}
        </Card.Text>
      </Card.Body>
    </Card>
    </Container>
  )
}
