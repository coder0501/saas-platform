import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

// Define types for orders
interface Customer {
    first_name: string;
    last_name: string;
}

interface Order {
    id: number;
    customer: Customer | null; // Customer can be null
    total_price: string; // Total price as string
    created_at: string; // Order creation date as string
}

interface ShopifyData {
    orders: Order[]; // Array of orders
    totalSales: number; // Total sales amount
    conversionRate: number; // Conversion rate
}

// Create the socket instance for real-time updates
const socket = io('http://localhost:5000', {
    withCredentials: true,
    transports: ['websocket'], // Use WebSocket as the transport method
});

const OrdersTable: React.FC = () => {
    // State to hold fetched orders and related data
    const [orders, setOrders] = useState<Order[]>(() => {
        const savedOrders = localStorage.getItem('orders');
        return savedOrders ? JSON.parse(savedOrders) : []; // Load orders from localStorage
    });

    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [totalSales, setTotalSales] = useState<number>(() => {
        const savedTotalSales = localStorage.getItem('totalSales');
        return savedTotalSales ? parseFloat(savedTotalSales) : 0; // Load total sales from localStorage
    });

    const [conversionRate, setConversionRate] = useState<number>(() => {
        const savedConversionRate = localStorage.getItem('conversionRate');
        return savedConversionRate ? parseFloat(savedConversionRate) : 0; // Load conversion rate from localStorage
    });

    const [ordersLength, setOrdersLength] = useState<number>(() => {
        const savedOrdersLength = localStorage.getItem('ordersLength');
        return savedOrdersLength ? parseFloat(savedOrdersLength) : 0; // Load orders length from localStorage
    });

    // States for sorting and filtering
    const [sortBy, setSortBy] = useState<'date' | 'sales'>('date'); // Sorting criteria
    const [priceFilter, setPriceFilter] = useState<string>('none'); // Price filter
    const [dateFilter, setDateFilter] = useState<string>('none'); // Date filter
    const [limitFilter, setLimitFilter] = useState<number | 'none'>('none'); // Limit filter for displaying orders
    const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state for manual refresh

    // Listen for real-time data from the server
    useEffect(() => {
        const handleShopifyData = (data: ShopifyData) => {
            const allOrders = data.orders;
            setOrders(allOrders);
            setFilteredOrders(allOrders);
            setTotalSales(data.totalSales);
            setOrdersLength(allOrders.length);
            setConversionRate(data.conversionRate);

            // Store the fetched data in localStorage for persistence
            localStorage.setItem('orders', JSON.stringify(allOrders));
            localStorage.setItem('totalSales', data.totalSales.toString());
            localStorage.setItem('conversionRate', data.conversionRate.toString());
            localStorage.setItem('ordersLength', allOrders.length.toString());
        };

        // Listen for 'shopifyData' events from the server
        socket.on('shopifyData', handleShopifyData);

        // Cleanup listener on component unmount
        return () => {
            socket.off('shopifyData', handleShopifyData);
        };
    }, []);

    // Apply filters whenever any of the filter states change
    useEffect(() => {
        applyFilters();
    }, [priceFilter, dateFilter, limitFilter, sortBy, orders]);

    // Function to apply all filters to the current orders
    const applyFilters = () => {
        let filtered = [...orders]; // Start with all orders

        // Filter by price
        if (priceFilter !== 'none') {
            const price = parseFloat(priceFilter);
            filtered = filtered.filter(order => parseFloat(order.total_price) > price); // Filter orders with total_price greater than selected price
        }

        // Filter by date
        if (dateFilter !== 'none') {
            const selectedDate = new Date(dateFilter);
            filtered = filtered.filter(order => new Date(order.created_at) > selectedDate); // Filter orders created after selected date
        }

        // Limit the number of orders displayed
        if (limitFilter !== 'none') {
            filtered = filtered.slice(0, limitFilter); // Limit to the specified number of orders
        }

        // Sort orders by date or sales amount
        if (sortBy === 'date') {
            filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); // Sort by creation date
        } else if (sortBy === 'sales') {
            filtered = filtered.sort((a, b) => parseFloat(b.total_price) - parseFloat(a.total_price)); // Sort by total sales amount
        }

        setFilteredOrders(filtered); // Update the filtered orders state
    };

    // Manual refresh for fetching data
    const handleManualRefresh = async () => {
        setIsLoading(true); // Set loading state to true
        try {
            const response = await axios.get('http://localhost:5000/api/shopify/orders', {
                withCredentials: true,
            });

            const { orders, totalSales, conversionRate, totalLength } = response.data.data;
            setOrders(orders);
            setFilteredOrders(orders);
            setTotalSales(totalSales);
            setConversionRate(conversionRate);
            setOrdersLength(totalLength);

            // Save data to localStorage for persistence
            localStorage.setItem('orders', JSON.stringify(orders));
            localStorage.setItem('totalSales', totalSales.toString());
            localStorage.setItem('conversionRate', conversionRate.toString());
            localStorage.setItem('ordersLength', totalLength.toString());
        } catch (error) {
            console.error('Error fetching orders:', error); // Log any errors
        }
        setIsLoading(false); // Reset loading state
    };

    return (
        <div className='orders-table'>
            <div>
                <div className='orders-table-container'>
                    <button onClick={handleManualRefresh} disabled={isLoading}>
                        {isLoading ? 'Refreshing...' : 'Manual Refresh'} {/* Display loading or refresh text */}
                    </button>
                    <select className='sortByDate' onChange={(e) => setSortBy(e.target.value as 'date' | 'sales')}>
                        <option value="date">Sort by Date</option>
                        <option value="sales">Sort by Sales Amount</option>
                    </select>
                    <select onChange={(e) => setPriceFilter(e.target.value)}>
                        <option value="none">Price Filter</option>
                        <option value="10">$10</option>
                        <option value="50">$50</option>
                        <option value="100">$100</option>
                        <option value="150">$150</option>
                    </select>
                    <input type="date" onChange={(e) => setDateFilter(e.target.value)} /> {/* Date input for filtering */}
                    <select onChange={(e) => setLimitFilter(e.target.value === 'none' ? 'none' : parseInt(e.target.value))}>
                        <option value="none">Limit</option>
                        <option value="10">10</option>
                        <option value="30">30</option>
                        <option value="50">50</option>
                        <option value="70">70</option>
                    </select>
                </div>
                <table border="3" cellPadding="10" cellSpacing="10">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Total Price / Sales Amount</th>
                            <th>Order Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : 'N/A'}</td>
                                <td>${parseFloat(order.total_price).toFixed(2)}</td>
                                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='order-details'>
                <h3>Total Sales: ${totalSales.toFixed(2)}</h3>
                <h3>Conversion Rate: ${conversionRate.toFixed(2)}</h3>
                <h3>Total Orders: {ordersLength}</h3>
            </div>
        </div>
    );
};

export default OrdersTable;
