import { useEffect, useState } from "react";


export function useLocalStorage(key, initialValue = null) {
 
  const [state, setState] = useState(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      try {
        return JSON.parse(storedValue);
      } catch {
        return storedValue;
      }
    }
    return initialValue;
  });

  
  useEffect(() => {
    if (typeof state === "object" && state !== null) {
      localStorage.setItem(key, JSON.stringify(state));
    } else {
      localStorage.setItem(key, state);
    }
  }, [key, state]);

 
  useEffect(() => {
    function handleStorageChange(event) {
      if (event.key === key) {
        const newValue = localStorage.getItem(key);
        if (newValue) {
          try {
            setState(JSON.parse(newValue));
          } catch {
            setState(newValue);
          }
        }
      }
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);


  return [state, setState];
}

function Form() {
 
  const [name, setName] = useState("");
  console.log(name);

  return (
    <form style={{ display: "flex", flexDirection: "column" }}>
      <label htmlFor="name">Name:</label>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
      <h4>{name ? `Welcome, ${name}!` : "Enter your name"}</h4>
    </form>
  );
}

function FormWithObject() {
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  function handleChange(e) {
    setFormData(formData => ({
      ...formData,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <form style={{ display: "flex", flexDirection: "column" }}>
      <label htmlFor="name">Title:</label>
      <input name="title" value={formData.title} onChange={handleChange} />
      <label htmlFor="name">Content:</label>
      <textarea
        name="content"
        value={formData.content}
        onChange={handleChange}
      />
    </form>
  );
}

export default function App() {
  return (
    <div>
      <h2>useLocalStorage can save string</h2>
      <Form />
      <hr />
      <h2>useLocalStorage can save objects (Bonus)</h2>
      <FormWithObject />
    </div>
  );
}