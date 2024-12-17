import React, { useState } from 'react';
import axios from 'axios';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { useLoadScript } from '@react-google-maps/api';

const libraries = ['places'];

const TripForm = () => {
    const [formData, setFormData] = useState({
        departure: '',
        destination: '',
        date: '',
        budget: '',
        schedule: [{ time: '', activity: '', origin: '', destination: '' }],
    });

    const [optimizedRoutes, setOptimizedRoutes] = useState({});
    const [error, setError] = useState('');
    const [tripResult, setTripResult] = useState(null);

    // Google Maps API 로드 상태
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    // 입력 필드 변경 핸들러
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 스케줄 필드 변경 핸들러
    const handleScheduleChange = (index, name, value) => {
        const newSchedule = [...formData.schedule];
        newSchedule[index][name] = value;
        setFormData({ ...formData, schedule: newSchedule });
    };

    // Google Places Autocomplete 핸들러
    const handleLocationSelect = async (index, name, address) => {
        try {
            const results = await geocodeByAddress(address);
            const latLng = await getLatLng(results[0]);
            console.log('Selected Location:', address, latLng);

            handleScheduleChange(index, name, address);
        } catch (error) {
            console.error('Error selecting location:', error);
            setError('Failed to fetch location details');
        }
    };

    // 일정 추가
    const addScheduleRow = () => {
        setFormData({
            ...formData,
            schedule: [...formData.schedule, { time: '', activity: '', origin: '', destination: '' }],
        });
    };

    // 일정 삭제
    const removeScheduleRow = (index) => {
        const newSchedule = formData.schedule.filter((_, i) => i !== index);
        setFormData({ ...formData, schedule: newSchedule });
    };

    // 일정 최적화 버튼 핸들러
    const handleOptimize = async (index) => {
        const { origin, destination } = formData.schedule[index];
    
        try {
            const response = await axios.post('http://localhost:3002/route', {
                origin,
                destination,
                waypoints: [], // 빈 배열로 초기화
            });
            console.log(response.data);
        } catch (error) {
            console.error('Optimization error:', error.message);
        }
    };

    // 폼 제출 (서버에 데이터 전송)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setTripResult(null);

        try {
            const response = await axios.post('http://localhost:3001/trip', formData);
            setTripResult(response.data);
        } catch (err) {
            console.error(err);
            setError('Error submitting trip plan. Please try again.');
        }
    };

    if (loadError) return <div>Error loading Google Maps API</div>;
    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div style={{ margin: '0 auto', width: '60%' }}>
            <h1>Plan Your Trip</h1>
            <form onSubmit={handleSubmit}>
                <label>Departure:</label>
                <input
                    type="text"
                    name="departure"
                    value={formData.departure}
                    onChange={handleChange}
                    required
                />

                <label>Destination:</label>
                <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                />

                <label>Date:</label>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />

                <label>Budget:</label>
                <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                />

                <h2>Schedule</h2>
                {formData.schedule.map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                            type="time"
                            name="time"
                            value={item.time}
                            onChange={(e) => handleScheduleChange(index, 'time', e.target.value)}
                            placeholder="Time"
                            required
                        />
                        <input
                            type="text"
                            name="activity"
                            value={item.activity}
                            onChange={(e) => handleScheduleChange(index, 'activity', e.target.value)}
                            placeholder="Activity"
                            required
                        />

                        {/* Origin Autocomplete */}
                        <PlacesAutocomplete
                            value={item.origin}
                            onChange={(value) => handleScheduleChange(index, 'origin', value)}
                            onSelect={(address) => handleLocationSelect(index, 'origin', address)}
                        >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <div>
                                    <input {...getInputProps({ placeholder: 'Origin...' })} />
                                    <div>
                                        {loading && <div>Loading...</div>}
                                        {suggestions.map((suggestion) => (
                                            <div
                                                {...getSuggestionItemProps(suggestion)}
                                                key={suggestion.placeId}
                                            >
                                                {suggestion.description}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </PlacesAutocomplete>

                        {/* Destination Autocomplete */}
                        <PlacesAutocomplete
                            value={item.destination}
                            onChange={(value) => handleScheduleChange(index, 'destination', value)}
                            onSelect={(address) => handleLocationSelect(index, 'destination', address)}
                        >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <div>
                                    <input {...getInputProps({ placeholder: 'Destination...' })} />
                                    <div>
                                        {loading && <div>Loading...</div>}
                                        {suggestions.map((suggestion) => (
                                            <div
                                                {...getSuggestionItemProps(suggestion)}
                                                key={suggestion.placeId}
                                            >
                                                {suggestion.description}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </PlacesAutocomplete>

                        {/* Optimize and Remove Buttons */}
                        <button type="button" onClick={() => removeScheduleRow(index)}>
                            Remove
                        </button>
                        <button type="button" onClick={() => handleOptimize(index)}>
                            Optimize
                        </button>

                        {/* Optimized Result */}
                        {optimizedRoutes[index] && (
                            <div style={{ color: 'green', fontSize: '0.9em' }}>
                                {optimizedRoutes[index]}
                            </div>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addScheduleRow}>
                    Add Schedule Row
                </button>
                <button type="submit">Save Trip Plan</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {tripResult && (
                <div>
                    <h2>Trip Plan Saved:</h2>
                    <pre>{JSON.stringify(tripResult, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default TripForm;