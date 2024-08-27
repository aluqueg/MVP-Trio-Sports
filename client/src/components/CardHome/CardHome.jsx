import Card from 'react-bootstrap/Card';

export const CardHome = ({data}) => {
  return (
    <Card style={{ width: '18rem', height: '400px' }}>
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>{data?.title}</Card.Title>
        <Card.Text>
          {data?.text}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}