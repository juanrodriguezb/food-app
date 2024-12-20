import { useContext } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import CartItem from "./CartItem";

export default function Cart() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    function handleHideCart() {
        userProgressCtx.hideCart()
    }

    function handleShowCheckout() {
        userProgressCtx.showCheckout()
    }

    const cartTotal = cartCtx.items.reduce((totalPrice, item) => (
        totalPrice + (item.quantity * item.price)
    ), 0)

    return (
        <Modal
            className="cart"
            open={userProgressCtx.progress === 'cart'}
            onClose={userProgressCtx.progress === 'cart' ? handleHideCart : null}
        >
            <h2>Your Cart</h2>
            <ul>
                {cartCtx.items.map((item) => (
                    <CartItem
                        key={item.id}
                        name={item.name}
                        quantity={item.quantity}
                        price={item.price}
                        onIncrease={() => cartCtx.addItem(item)}
                        onDecrease={() => cartCtx.removeItem(item.id)}
                    />
                ))}
            </ul>
            <p className="cart-total">{currencyFormatter.format(cartTotal)}</p>
            <p className="modal-actions">
                <Button
                    textOnly
                    onClick={handleHideCart}
                >
                    Close
                </Button>
                {cartCtx.items.length > 0 && (
                    <Button
                        onClick={handleShowCheckout}>
                        Go to Checkout
                    </Button>)}
            </p>
        </Modal>
    )
}