import { useEffect, useState } from "react";
import puhelinluetteloService from "./services/puhelinluetteloService";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import Notification from "./components/Notification";
import './index.css';

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [filter, setFilter] = useState("");
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        puhelinluetteloService.getAll().then((initialPersons) => {
            setPersons(initialPersons);
        });
    }, []);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };

    const addPerson = (event) => {
        event.preventDefault();
      
        const existingPerson = persons.find(
          (person) => person.name === newName
        );
      
        if (existingPerson) {
          if (
            window.confirm(
              `${newName} on jo puhelinluettelossa, korvataanko vanha numero uudella?`
            )
          ) {
            const changedPerson = { ...existingPerson, number: newNumber };
      
            puhelinluetteloService
              .update(existingPerson.id, changedPerson)
              .then((returnedPerson) => {
                setPersons(
                  persons.map((person) =>
                    person.id !== existingPerson.id ? person : returnedPerson
                  )
                );
                setNewName("");
                setNewNumber("");
                showNotification(
                  `Muutettiin ${returnedPerson.name} numero`,
                  "success"
                );
              })
              .catch((error) => {
                console.error("error updating person:", error);
                // Näytä virheilmoitus
                if (error.response && error.response.data && error.response.data.error) {
                  showNotification(error.response.data.error, "error");
                } else {
                  showNotification(
                    `Henkilö '${existingPerson.name}' on jo poistettu palvelimelta.`,
                    "error"
                  );
                }
                setPersons(
                  persons.filter((person) => person.id !== existingPerson.id)
                );
              });
          }
        } else {
          const personObject = {
            name: newName,
            number: newNumber,
          };
      
          puhelinluetteloService
            .create(personObject)
            .then((returnedPerson) => {
              setPersons(persons.concat(returnedPerson));
              setNewName("");
              setNewNumber("");
              showNotification(`Lisättiin ${returnedPerson.name}`, "success");
            })
            .catch((error) => {
              console.log("error adding person:", error);
              // Näytä validointivirhe käyttäjälle
              if (error.response && error.response.data && error.response.data.error) {
                showNotification(error.response.data.error, "error");
              } else {
                showNotification("Henkilön lisääminen epäonnistui", "error");
              }
            });
        }
      };

    const deletePerson = (id, name) => {
        if (window.confirm(`Delete ${name}?`)) {
            puhelinluetteloService
                .remove(id)
                .then(() => {
                    setPersons(persons.filter((person) => person.id !== id));
                    showNotification(`Poistettiin ${name}`, "success");
                })
                .catch((error) => {
                    console.error("error deleting person:", error),
                    showNotification(
                        `Henkilö '${name}' on jo poistettu palvelimelta.`,
                        "error"
                    );
                    setPersons(persons.filter((person) => person.id !== id));
                });
        }
    };

    const handleNameChange = (event) => {
        setNewName(event.target.value);
    };

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const personsToFilter = filter
        ? persons.filter((person) =>
              person.name.toLowerCase().includes(filter.toLowerCase())
          )
        : persons;

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification
                message={notification?.message}
                type={notification?.type}
            />
            <Filter value={filter} onChange={handleFilterChange} />
            <h3>Add a new</h3>
            <PersonForm
                onSubmit={addPerson}
                nameValue={newName}
                onNameChange={handleNameChange}
                numberValue={newNumber}
                onNumberChange={handleNumberChange}
            />
            <h3>Numbers</h3>
            <Persons persons={personsToFilter} onDelete={deletePerson} />
        </div>
    );
};

export default App;
