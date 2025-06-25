import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { app } from "../firebase/firebase.config";
import { toast } from "react-toastify";

const auth = getAuth(app);

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    photoURL: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password) => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    return pattern.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, photoURL } = form;

    if (!validatePassword(password)) {
      toast.error("Password must be at least 6 characters with uppercase & lowercase.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: photoURL
      });
      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center mt-[-30px]">
      <div className=" p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Name"
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="photoURL"
            type="text"
            placeholder="Photo URL"
            className="w-full border p-2 rounded"
            value={form.photoURL}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
