
import './AddressForm.css'

function AddressForm ( {AddressInfo, setAddressInfo} ) {

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddressInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className='payment-container'>
                    <div className='payment-container'>
                    <form className="payment-form">
                        <label>
                            <p>Address:</p>
                            <input
                                type="text"
                                name="address"
                                value={AddressInfo.address}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            <p>City:</p>
                            <input
                                type="text"
                                name="city"
                                value={AddressInfo.city}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            <p>Postal Code:</p>
                            <input
                                type="text"
                                name="postalCode"
                                value={AddressInfo.postalCode}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            <p>Country:</p>
                            <input
                                type="text"
                                name="country"
                                value={AddressInfo.country}
                                onChange={handleInputChange}
                            />
                        </label>
                    </form>
                </div>
            </div>
    )
}

export default AddressForm