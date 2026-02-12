import { useEffect, useState } from "react";


function App(){
  // Variables for States
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Setup UseEffect for loading data
  useEffect(() => {
    async function loadData() {
      try{
        // fetch data
        const response = await fetch("https://exercisedb.p.rapidapi.com/exercises?limit=5", {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_EXERCISE_API_KEY,
            "X-RapidAPI-Host": import.meta.env.VITE_EXERCISE_API_HOST,

          },
        });
        const data = await response.json();
        console.log(data);
        // Store the grabbed data in the array
        setExercises(data);
        
      } catch (err) {
        // handle error
        console.log("Error fetching exercises:", err);
      } finally {
        // stop loading
        console.log("Done fetching (success or fail)");
      }
    }
    loadData();
  }, []);
  


  return(
    <div>
      <h1>Fitness Dashboard</h1>
      {exercises.length > 0 && exercises.map((exercise, index) => (
        <p key={index}>
          Exercise: {exercise.name}, --- Muscle targeted: {exercise.target}
        </p>
      ))}
     
    </div>
    
  )
}

export default App;