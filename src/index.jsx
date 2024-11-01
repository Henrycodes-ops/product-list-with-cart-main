import React, { useState } from "react";
import dataJson from "../data.json";
import addToCart from "../assets/images/icon-add-to-cart.svg";
import image from "../assets/images/illustration-empty-cart.svg";
import carbonFree from "../assets/images/icon-carbon-neutral.svg";
import iconConfirmed from "../assets/images/icon-order-confirmed.svg";


const BodyComponent = () => {
  const [items, setItems] = useState(
    dataJson.map((item) => ({
      ...item,
      showIcon: false,
      isActive: false,
      quantity: 0,
    }))
  );

  const [cartItems, setCartItems] = useState([]); // State for cart items
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

  // Calculate total price dynamically
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Add or remove items in cart
  const handleAddToCart = (selectedItem, index, action) => {
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              showIcon: true,
              isActive: action === "increment" || item.quantity > 0,
              quantity: 
                action === "increment"
                  ? item.quantity + 1
                  : Math.max(0, item.quantity - 1),
            }
          : item
      )
    );
  
    setCartItems((prev) => {
      const itemExists = prev.find((item) => item.name === selectedItem.name);
  
      if (action === "increment") {
        if (itemExists) {
          // Update quantity for an existing item in the cart
          return prev
          .map((item) =>
            item.name === selectedItem.name
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          // Add new item to the cart with quantity 1
          return [...prev, { ...selectedItem, quantity: 1 }];
        }
      } else if (action === "decrement") {
        // Decrement quantity or remove item if quantity becomes 0
        return prev
          .map((item) =>
            item.name === selectedItem.name
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0);
      }
      return prev;
    });
  };
  
  // Remove item from cart
  const handleRemoveFromCart = (name) => {
    setCartItems((prev) => prev.filter((item) => item.name !== name));
  
    // Reset quantity and states for the removed item
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.name === name
          ? {
              ...item,
              quantity: 0,
              showIcon: false,
              isActive: false,
            }
          : item
      )
    );
  };

  

  // Handle modal visibility
  const handleConfirmOrder = () => setIsModalOpen(true);
  const handleNewOrder = () => {
    setItems(
      dataJson.map((item) => ({
        ...item, 
        quantity: 0,
        showIcon: false,
        isActive: false,
      }))
    );
    setCartItems([]); // Clear cart
    setIsModalOpen(false); // Close modal
  };

    // Increment quantity


  


  return (
    <section className="mainContainer">
      <div className="container">
        <Header />
        <FoodItemList items={items} handleAddToCart={handleAddToCart} />
      </div>
      <Cart
        cartItems={cartItems}
        handleRemoveFromCart={handleRemoveFromCart}
        total={total}
        handleConfirmOrder={handleConfirmOrder}
        isModalOpen={isModalOpen}
        handleNewOrder={handleNewOrder}
      />
    </section>
  );
};

const Header = () => (
  <div className="headerContainer">
    <h2 className="header">Desserts</h2>
  </div>
);

const FoodItemList = ({ items, handleAddToCart }) => (
  <div className="foodItemContainer">
    {items.map((item, index) => (
      <FoodItem
        key={item.id}
        data={item}
        onAddToCart={(action) => handleAddToCart(item, index, action)}
      />
    ))}
  </div>
);

const FoodItem = ({ data, onAddToCart }) => (
  <div className="itemContainer">
    <div className={`imageSection ${data.isActive ? "active" : ""}`}>
      <div className="img">
        <img src={data.image.desktop} alt={data.name} id="dataImage" className="none"/>
        <img src={data.image.mobile} alt={data.name} id="hide" />
      </div>
      <div className="buttonDiv">
        <button
          className={`addToCartButton ${data.showIcon ? "active" : ""}`}
          onClick={() => onAddToCart("increment")}
        >
          {data.showIcon ? (
            <ItemControls
            quantity={data.quantity}
            onIncrement={() => onAddToCart(data, index, "increment")}
            onDecrement={() => onAddToCart(data, index, "decrement")}
          />
          
          ) : (
            <>
              <img src={addToCart} alt="Add to cart" />
              Add to cart
            </>
          )}
        </button>
      </div>
    </div>
    <p id="dataCategory">{data.category}</p>
    <p id="dataName">{data.name}</p>
    <p id="dataPrice">${data.price.toFixed(2)}</p>
  </div>
);

const ItemControls = ({ quantity, onIncrement, onDecrement }) => (
  <div className="icons visibleIcons iconFlex">
    <div className="iconDecrement" onClick={quantity > 0 ? onDecrement : null}>
      <svg
        className="decrease"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5 12h14" stroke="" strokeWidth="2" />
      </svg>
    </div>
    <span>{quantity}</span>
    <div className="iconIncrement" onClick={onIncrement}>
      <svg
        className="iconIncrementImg "
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 5v14M5 12h14" stroke="" strokeWidth="2" />
      </svg>
    </div>
  </div>
);

const Cart = ({
  cartItems,
  handleRemoveFromCart,
  total,
  handleConfirmOrder,
  isModalOpen,
  handleNewOrder,
}) => (
  <div className="yourCartDiv">
    <h2 id="yourCartHeader">
      Your Cart (<span>{cartItems.length}</span>)
    </h2>
    <div className="centeredContent">
      {cartItems.length > 0 ? (
        <>
          {cartItems.map((item) => (
            <CartItem
              key={item.name}
              item={item}
              onRemove={() => handleRemoveFromCart(item.name)}
            />
          ))}
          <OrderSummary
            total={total}
            handleConfirmOrder={handleConfirmOrder}
            isModalOpen={isModalOpen}
            handleNewOrder={handleNewOrder}
            cartItems={cartItems}
          />
        </>
      ) : (
        <EmptyCartMessage />
      )}
    </div>
  </div>
);

const CartItem = ({ item, onRemove }) => (
  <div className="cartItem">
    <div className="itemName">
      <h3>{item.name}</h3>
    </div>
    <div className="cartItems">
      <div className="cart-price-flex">
        <p>
          <span className="timesClicked">{item.quantity}</span>x @$
          {item.price.toFixed(2)}
        </p>
        <div id="totalPrice">
          <p>${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>

      
      <div className="closeButtonDiv">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          className="closeButton"
          onClick={onRemove}
          style={{ cursor: "pointer", stroke: "", strokeWidth: 2 }}
        >
          <line x1="18" y1="6" x2="6" y2="18" stroke="" />
          <line x1="6" y1="6" x2="18" y2="18" stroke="" />
        </svg>
      </div>
    </div>
  </div>
);

const OrderSummary = ({
  total,
  handleConfirmOrder,
  isModalOpen,
  handleNewOrder,
  cartItems,
}) => (
  <>
    <div className="orderTotalDiv">
      <p id="order">Order</p>
      <h4 className="order-total">${total.toFixed(2)}</h4>
    </div>
    <div className="carbon-neutral-div">
      <img src={carbonFree} alt="" />
      <p>
        This is a <b className="bold">carbon-neutral</b> delivery
      </p>
    </div>
    <button onClick={handleConfirmOrder}>Confirm Order</button>

    {isModalOpen && (
      <div className="modal-overlay">
        <div className="modal">
          <img src={iconConfirmed} alt="" />
          <h2>Order Confirmed</h2>
          <p className="">We hope you enjoy your food!</p>
          <ul className="order-summary">
            {cartItems.map((item) => (
              <li key={item.id}>
                <div className="order-flex">
                <img src={item.image.desktop} alt={item.name} />
                <div>
                   <p id="item-name">
                    <span>{item.name}</span>
                  </p>
                  <span className="span-flex">
                    <p id="itemQuantity">{item.quantity}x</p>
                    <div>
                      <p>@ ${item.price.toFixed(2)}</p>
                    </div>
                  </span>
                </div>
                 
                </div>
                <h4 className="orderSummaryTotal">
                  {" "}
                  ${(item.price * item.quantity).toFixed(2)}
                </h4>
              </li>
            ))}
          </ul>
          <div className="flex">
            <p id="order">Order Total</p>

            <div>
              <h4 className="order-total">${total.toFixed(2)}</h4>
            </div>
          </div>
          <button onClick={handleNewOrder} className="new-order-btn">
            Start New Order
          </button>
        </div>
      </div>
    )}
  </>
);

const EmptyCartMessage = () => (
  <div className="centeredContent">
    <img src={image} alt="" id="yourCartImage" />
    <p className="yourCartMessage">Your added items will appear here</p>
  </div>
);

export default BodyComponent;
