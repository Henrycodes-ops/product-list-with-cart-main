import React from "react";
import dataJson from "../data.json";
import { useState } from "react";
import image from "../assets/images/illustration-empty-cart.svg";
import addToCart from "../assets/images/icon-add-to-cart.svg";
import closeButton from "../assets/images/icon-remove-item.svg";
import iconIncrement from "../assets/images/icon-increment-quantity.svg";
import iconDecrement from "../assets/images/icon-decrement-quantity.svg";

const BodyComponent = () => {
  const [cartItems, setCartItems] = useState([]);
  // Assuming you have an array of boolean values (one for each item)
  const [showIconsArray, setShowIconsArray] = useState(
    dataJson.map(() => false)
  );

  const [itemActiveStates, setItemActiveStates] = useState(
    dataJson.map(() => false)
  );

  const [itemQuantity, setItemQuantity] = useState(dataJson.map(() => 0));

  const [clickCount, setClickCount] = useState(0);

  // Increment button click handler
  const handleIncrement = () => {
    setClickCount(clickCount + 1);
  };

  const handleAddtoCart = (selectedItem, index, action) => {
    // Check if the item is already in the cart
    const itemExists = cartItems.some(
      (item) => item.name === selectedItem.name
    );

    if (!itemExists) {
      // Create a new cart item object with name and price
      const newItem = {
        name: selectedItem.name,
        price: selectedItem.price,
      };

      // Add the new item to the cart
      setCartItems((prevCart) => [...prevCart, newItem]);
    } else {
      // Item already exists in the cart; you can show a message or handle it as needed
      console.log(`"${selectedItem.name}" is already in your cart.`);
    }

    const updatedShowIconsArray = [...showIconsArray];
    updatedShowIconsArray[index] = true;
    setShowIconsArray(updatedShowIconsArray);
    const updatedItemActiveStates = [...itemActiveStates];
    updatedItemActiveStates[index] = !updatedItemActiveStates[index];
    setItemActiveStates(updatedItemActiveStates);
    const updatedItemQuantity = [...itemQuantity];

    if (action === "increment") {
      updatedItemQuantity[index]++;
    } else if (action === "decrement" && updatedItemQuantity[index] > 0) {
      updatedItemQuantity[index]--;
    }
    setItemQuantity(updatedItemQuantity);
  };
  const handleRemoveFromCart = (index) => {
    // Remove the item at the specified index
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
  };

  // Decrement button click handler
  const handleDecrement = () => {
    setClickCount(clickCount - 1);
  };

  return (
    <section className="mainContainer">
      {/* Main container for the entire section */}
      <div className="container">
        {/* Container for the food items */}
        <div className="headerContainer">
          {/* Header for the section */}
          <h2 className="header">Desserts</h2>
        </div>
        <div className="foodItemContainer">
          {/* Container for individual food items */}
          {dataJson.map((data, index) => {
            return (
              <div key={data.id} className="itemContainer">
                {/* Individual food item */}
                <div
                  className={`imageSection ${
                    itemActiveStates[index] ? "active" : ""
                  }`}
                >
                  {/* Section containing the food image */}
                  <div className="img">
                    <img
                      src={data.image.desktop}
                      alt="Food Images"
                      id="dataImage"
                    />
                  </div>
                  <div className="buttonDiv">
                    {/* Button to add item to cart */}
                    <button
                      className={`addToCartButton ${
                        showIconsArray[index] ? "active" : ""
                      }`}
                      onClick={() => handleAddtoCart(data, index)}
                    >
                      {showIconsArray[index] ? (
                        <div className="icons visibleIcons iconFlex">
                          <div className="iconDecrement">
                            <button
                              onClick={() => {
                                handleAddtoCart(data, index, "decrement");
                                handleDecrement(index);
                              }}
                              // Disable the decrement icon when quantity is zero
                              className={
                                itemQuantity[index] === 0 ? "disabled" : ""
                              }
                            >
                              <img src={iconDecrement} alt="Decrement" />
                            </button>
                          </div>

                          <span>{itemQuantity[index]}</span>
                          <div className="iconIncrement">
                            <button
                              className="increment"
                              onClick={
                                () => {
                                  handleAddtoCart(data, index, "increment");
                                  handleIncrement(index);
                                }
                                // handleIncrement
                              }
                            >
                              <img
                                src={iconIncrement}
                                alt="Increment"
                                className="iconIncrement"
                              />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <img src={addToCart} alt="Cart image" />
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
          })}
        </div>
      </div>
      {/* Container for the user's cart */}
      <div className="yourCartDiv">
        <h2 id="yourCartHeader">
          Your Cart (<span>{cartItems.length}</span>)
        </h2>
        <div className="centeredContent">
          {cartItems.map((item, index) => (
            <div key={index} className="cartItem">
              <div className="cartItems">
                <div className="cartSpanItem">
                  <p id="spanText">
                    <span className="timesClicked">{clickCount}</span>x
                  </p>
                </div>
                <div className="itemsContainer">
                <p className="item">{item.name}</p>
                  <div className="div">
                <p className="item">${item.price.toFixed(2)}</p>

                  </div>
                </div>
              </div>

              <button
                className="closeButton"
                onClick={() => handleRemoveFromCart(index)}
              >
                <img src={closeButton} alt="" />
              </button>
              <div>
                
              </div>
            </div>
          ))}
          {cartItems.length === 0 && (
            <div className="emptyCartMessage">
              <img src={image} id="yourCartImage" alt="Your Cart" />
              <p className="yourCartMessage">
                Your added items will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BodyComponent;
