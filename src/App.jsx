import { useEffect, useState } from "react";

function App() {
  // Variables for States
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Search text
  const [list, setList] = useState([]); // The list of exercises in each workout
  const [workouts, setWorkouts] = useState([]); // The list of workouts created
  const [openDropdownId, setOpenDropdownId] = useState(null); // dropdown open for exercise index

  // Setup UseEffect for loading data
  useEffect(() => {
    async function loadData() {
      try {
        // fetch data
        const response = await fetch(
          "https://exercisedb.p.rapidapi.com/exercises?limit=10",
          {
            method: "GET",
            headers: {
              "X-RapidAPI-Key": import.meta.env.VITE_EXERCISE_API_KEY,
              "X-RapidAPI-Host": import.meta.env.VITE_EXERCISE_API_HOST,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        // Store the grabbed data in the array
        setExercises(data);
      } catch (err) {
        // handle error
        console.log("Error fetching exercises:", err);
      } finally {
        // stop loading
        setLoading(false);
        console.log("Done fetching (success or fail)");
      }
    }
    loadData();
  }, []);

  // function to create new workouts
  function addWorkout() {
    const newWorkout = {
      id: Date.now(), // unique id
      name: "New Workout", // default name
      exercises: [], // empty array
    };
    setWorkouts([...workouts, newWorkout]); // add to list of existing workouts
  }

  // addItem to workout function
  function addItem(exerciseIndex, workoutId) {
    const updatedWorkouts = workouts.map((w) => {
      if (w.id === workoutId) {
        const exerciseToAdd = exercises[exerciseIndex];
        return { ...w, exercises: [...w.exercises, exerciseToAdd] };
      }
      return w;
    });
    setWorkouts(updatedWorkouts);
    setOpenDropdownId(null); // close dropdown after adding
  }

  // normalize strings by removing punctuation and spaces
  const normalize = (string) =>
    string.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Filter based on the search text
  const filteredExercises = exercises.filter((exercise) =>
    normalize(exercise.name).includes(normalize(searchTerm))
  );

  // App component rendering
  return (
    <div style={{ backgroundColor: "#2f2f2f", minHeight: "100vh", padding: "20px" }}>
      <h1 className="pageTitle">Fitness Dashboard</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search exercises..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Create new workout */}
      <button onClick={addWorkout}>Create Workout</button>

      {/* Workout list */}
      {workouts.map((workout) => (
        <div key={workout.id} className="workoutCard">
          <h3 className="workoutTitle">{workout.name}</h3>
          {workout.exercises.length > 0 ? (
            <ul>
              {workout.exercises.map((exercise, i) => (
                <li key={i}>{exercise.name}</li>
              ))}
            </ul>
          ) : (
            <p>No exercises yet</p>
          )}
        </div>
      ))}

      {/* Exercises */}
      {exercises.length > 0 &&
        filteredExercises.map((exercise, index) => (
          <div key={index} className="exerciseCard">
            <h3>{exercise.name}</h3>
            <p>
              <strong>Target: </strong>
              {exercise.target}
            </p>
            <p>
              <strong>Body Part: </strong>
              {exercise.bodyPart}
            </p>
            <p>
              <strong>Equipment: </strong>
              {exercise.equipment}
            </p>

            {/* Add to workout button and dropdown */}
            <button
              className="addWorkoutButton"
              onClick={() =>
                setOpenDropdownId(openDropdownId === index ? null : index)
              }
            >
              Add to Workout
            </button>

            {openDropdownId === index && workouts.length > 0 && (
              <select
                onChange={(e) => addItem(index, Number(e.target.value))}
                defaultValue=""
              >
                <option value="" disabled>
                  Select workout
                </option>
                {workouts.map((workout) => (
                  <option key={workout.id} value={workout.id}>
                    {workout.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
    </div>
  );
}

export default App;
