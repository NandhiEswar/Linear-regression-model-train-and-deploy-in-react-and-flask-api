import './App.css';
import { useState, useRef, useId } from 'react';

function App() {
  const id = useId();
  const ageRef = useRef(null);
  const bmiRef = useRef(null);
  const childrenRef = useRef(null);
  const genderRef = useRef(null);
  const smokingRef = useRef(null);
  const regionRef = useRef(null);

  const [errors, setErrors] = useState({
    age: '',
    bmi: '',
    children: '',
    gender: '',
    smoking: '',
    region: '',
  });

  const [result, setResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {
      age: '',
      bmi: '',
      children: '',
      gender: '',
      smoking: '',
      region: '',
    };

    // Validate required fields
    if (!ageRef.current.value) newErrors.age = 'Age is required';
    if (!bmiRef.current.value) newErrors.bmi = 'BMI is required';
    if (!childrenRef.current.value)
      newErrors.children = 'Number of children is required';
    if (!genderRef.current.value) newErrors.gender = 'Gender is required';
    if (!smokingRef.current.value) newErrors.smoking = 'Smoking status is required';
    if (!regionRef.current.value) newErrors.region = 'Region is required';

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== '');
    if (!hasErrors) {
      const age = ageRef.current.value;
      const bmi = bmiRef.current.value;
      const children = childrenRef.current.value;
      const gender = genderRef.current.value;
      const smoking = smokingRef.current.value;
      const region = regionRef.current.value;

      // Map the gender fields
      const sex_male = gender === 'male' ? 1 : 0;
      const sex_female = gender === 'female' ? 1 : 0;

      // Map the smoking fields
      const smoker_yes = smoking === 'yes' ? 1 : 0;
      const smoker_no = smoking === 'no' ? 1 : 0;

      // Map the region fields
      const region_northwest = region === 'northwest' ? 1 : 0;
      const region_southeast = region === 'southeast' ? 1 : 0;
      const region_southwest = region === 'southwest' ? 1 : 0;
      const region_northeast = region === 'northeast' ? 1 : 0;

      try {
        // POST request
        const postResponse = await fetch(
          `https://api.nandhieswar.site/predict/${id}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              age: Number(age),
              bmi: Number(bmi),
              children: Number(children),
              sex_male,
              sex_female,
              smoker_yes,
              smoker_no,
              region_northwest,
              region_southeast,
              region_southwest,
              region_northeast,
            }),
          }
        );

        if (postResponse.ok) {
          // GET request to fetch the value
          const getResponse = await fetch(
            `https://api.nandhieswar.site/return_value/${id}`
          );
          if (getResponse.ok) {
            const data = await getResponse.json();
            setResult(data); 
            console.log(data)
          } else {
            console.error('Failed to fetch the result');
          }
        } else {
          console.error('Failed to submit the form');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="container mx-auto py-10">
      <form
        className="bg-gray-100 p-6 rounded-lg shadow-md space-y-4"
        onSubmit={handleSubmit}
      >
        {/* Form Fields */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Age</label>
          <input
            type="number"
            ref={ageRef}
            className="border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring focus:ring-indigo-300"
          />
          {errors.age && <small className="text-red-500 mt-1">{errors.age}</small>}
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">BMI</label>
          <input
            type="number"
            step="0.000001"
            ref={bmiRef}
            className="border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring focus:ring-indigo-300"
          />
          {errors.bmi && <small className="text-red-500 mt-1">{errors.bmi}</small>}
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Children</label>
          <input
            type="number"
            ref={childrenRef}
            className="border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring focus:ring-indigo-300"
          />
          {errors.children && (
            <small className="text-red-500 mt-1">{errors.children}</small>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Select your gender</label>
          <select
            ref={genderRef}
            className="border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring focus:ring-indigo-300"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && (
            <small className="text-red-500 mt-1">{errors.gender}</small>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Smoking</label>
          <select
            ref={smokingRef}
            className="border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring focus:ring-indigo-300"
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {errors.smoking && (
            <small className="text-red-500 mt-1">{errors.smoking}</small>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Region</label>
          <select
            ref={regionRef}
            className="border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring focus:ring-indigo-300"
          >
            <option value="">Select</option>
            <option value="southwest">Southwest</option>
            <option value="southeast">Southeast</option>
            <option value="northwest">Northwest</option>
            <option value="northeast">Northeast</option>
          </select>
          {errors.region && (
            <small className="text-red-500 mt-1">{errors.region}</small>
          )}
        </div>

        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300"
        >
          Submit
        </button>
      </form>

      {/* Display the result */}
      {result && (
        <p className="text-green-600 mt-4">Predicted Value: {result["prediction"]}</p>
      )}
    </div>
  );
}

export default App;
