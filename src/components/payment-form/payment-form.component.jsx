import { PaymentFormContainer, FormContainer } from './payment-form.styles';
import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js';
import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const paymentHandler = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
      }
      

      const response = await fetch('/.netlify/functions/create-payment-intent', {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: 1000 })
      }).then(res => res.json());

      const { paymentIntent: { client_secret } } = response;

      console.log(client_secret);
      
      const paymentResult = await stripe.confirmCardPayment(client_secret, {
          payment_method: {
              card: elements.getElement(CardElement),
              billing_details: {
                  name: 'Luciano Developer'
              },
          },
      });

      if (paymentResult.error) {
        alert('Payment Error', paymentResult.error)
      } else {
          if (paymentResult.paymentIntent.status === 'succeeded') {
              alert('Payment Successful');
          }
      }

  };

  return (
    <PaymentFormContainer>
          <FormContainer onSubmit={paymentHandler}>
        <h2>Credit Card Payment:</h2>
        <CardElement />
        <Button buttonType={BUTTON_TYPE_CLASSES.inverted}>Pay Now</Button>
      </FormContainer>
    </PaymentFormContainer>
  );
};

export default PaymentForm;
