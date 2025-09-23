const Header = (props) => {
    console.log(props);
    return (
        <div>
            <h1>{props.course}</h1>
        </div>
    );
};

const Part = (props) => {
    console.log(props);
    return (
        <p>
            {props.part}, exercises: {props.exercises}
        </p>
    );
};

const Content = (props) => {
    console.log(props);
    return (
        <div>
            <Part
                part={props.parts[0].name}
                exercises={props.parts[0].exercises}
            />
            <Part
                part={props.parts[1].name}
                exercises={props.parts[1].exercises}
            />
            <Part
                part={props.parts[2].name}
                exercises={props.parts[2].exercises}
            />
        </div>
    );
};

const Total = (props) => {
    console.log(props);
    const total = props.parts.reduce((sum, part) => sum + part.exercises, 0);
    return (
        <div>
            <p>Number of exercises in total: {total}</p>
        </div>
    );
};

const App = () => {
    const course = 'Half Stack application development'
    const part1 = {
      name: 'Fundamentals of React',
      exercises: 10
    }
    const part2 = {
      name: 'Using props to pass data',
      exercises: 7
    }
    const part3 = {
      name: 'State of a component',
      exercises: 14
    }

    const parts = [part1, part2, part3];

    return (
        <div>
            <Header course={course} />
            <Content parts={parts} />
            <Total parts={parts} />
        </div>
    );
};

export default App;
