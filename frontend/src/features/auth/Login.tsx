import { useState } from "react";

const Login = () => {
    const [count, setCount] = useState(0);

    return (
        <>
            <div>
                <h1>Login</h1>
            </div>

            <button  onClick={() => setCount((count) => count + 1)}>
                count is {count}
            </button>
        </>
    );
}

export default Login;