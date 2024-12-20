import { useContext, useActionState } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import UserProgressContext from "../store/UserProgressContext";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import useHttp from "../hooks/useHTTP";
import Error from "./Error";

const requestConfig = {
    method: 'POST',
    headers: {
        'Content-type': 'application/json'
    }
};

export default function Checkout() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const {
        data,
        error,
        sendRequest,
        clearData,
    } = useHttp('http://localhost:3000/orders', requestConfig);

    const cartTotal = cartCtx.items.reduce((totalPrice, item) => (
        totalPrice + (item.quantity * item.price)
    ), 0)

    function handleCLose() {
        userProgressCtx.hideCheckout();
    }

    function handleFinish() {
        userProgressCtx.hideCheckout();
        cartCtx.clearCart();
        clearData();
    }

    async function checkoutAction(prevState, fd) {
        const customerData = Object.fromEntries(fd.entries());

        await sendRequest(JSON.stringify({
            order: {
                items: cartCtx.items,
                customer: customerData
            }
        })
        );
    }

    const [formState, formAction, pending] = useActionState(checkoutAction, null);

    let actions = (
        <>
            <Button
                textOnly
                type="button"
                onClick={handleCLose}>Close</Button>
            <Button>Submit Order</Button>
        </>
    );

    if (pending) {
        actions = <span>Sending order data...</span>;
    }

    if (data && !error) {
        return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleFinish}>
            <h2>Success!</h2>
            <p>Your order was submitted successfully.</p>
            <p>We will get back to you with more details via email within the next few minutes.</p>
            <p className="modal-actions">
                <Button onClick={handleFinish}>Okay</Button>
            </p>
        </Modal>
    }
    return (
        <Modal
            open={userProgressCtx.progress === 'checkout'}
            onClose={handleCLose}
        >
            <form action={formAction}>
                <h2>Checkout</h2>
                <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

                <Input
                    label="Full Name"
                    type='text'
                    id='name'
                />
                <Input
                    label="Email Address"
                    type="email"
                    id="email"
                />
                <Input
                    label="Street"
                    type="text"
                    id="street"
                />
                <div className="control-row">
                    <Input
                        label="Postal Code"
                        type="text"
                        id="postal-code"
                    />
                    <Input
                        label="City"
                        type="text"
                        id="city"
                    />
                </div>
                {error && (
                    <Error
                        title="Failed to submit order"
                        message={error}
                    />
                )}
                <p className="modal-actions">
                    {actions}
                </p>
            </form>
        </Modal>
    )
}