import { LoaderCircle } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../ui/button'
import { CardContent, CardDescription, CardFooter, CardTitle, Card, CardHeader } from '../ui/card'
import { Input } from '../ui/input'
import { useMutation } from '@tanstack/react-query'


import { extractErrorMessages } from '../../utility/errorUtility'
import api from '../../lib/api/apiStore'

type FormValueType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};



const RegisterForm = () => {

    const navigate = useNavigate();

    // State for form values
    const [formValues, setFormValues] = useState<FormValueType>({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState<string | null>(null)

    const registerMutation = useMutation({
        mutationFn: async (userData: Omit<FormValueType, "confirmPassword">) => {
            const response = await api.post('/Auth/register', userData)
            return response.data
        },
        onSuccess: () => {
            navigate('/login')
        },
        onError: (err) => {
            console.log("err", err)
            setError(extractErrorMessages(err))
        }
    })

    // onChange 

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
      };

    // onSubmit 

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)

        if (!formValues.name || !formValues.email || !formValues.password) {
            setError('All fields are required')
            return
        }

        if (formValues.password !== formValues.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        registerMutation.mutate({
            name: formValues.name,
            email: formValues.email,
            password: formValues.password
        })
    }

    return (
        <Card className="w-full bg-card rounded-md">
            <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl text-center">Create an account</CardTitle>
                <CardDescription className={"text-center"}>
                    Enter your details to register
                </CardDescription>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4 pt-0">
                        {
                            error && (
                                <div className='p-3 bg-destructive/10 text-destructive text-sm rounded-md'>
                                    {error}
                                </div>
                            )
                        }
                        <div className='space-y-2'>
                            <div className='text-sm  font-medium text-left'>
                                Full Name
                            </div>
                            <Input
                               className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground"
                                name="name"
                                placeholder="John Doe"
                                required
                                value={formValues.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='space-y-2'>
                            <div className='text-sm font-medium text-left'>
                                Email
                            </div>
                            <Input name="email"
                             className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground"
                                placeholder="email@email.com"
                                required
                                value={formValues.email}
                                onChange={handleInputChange} />
                        </div>
                        <div className='space-y-2'>
                            <div className='text-sm font-medium text-left'>
                                Password
                            </div>
                            <Input
                             className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground"
                                name="password"
                                type={"password"}
                                placeholder="*****"
                                required

                                value={formValues.password}
                                onChange={handleInputChange} />
                        </div>
                        <div className='space-y-2'>
                            <div className='text-sm font-medium text-left'>
                                Confirm Password
                            </div>
                            <Input
                              className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground"
                                name="confirmPassword"
                                type={"password"}
                                placeholder="******"
                                required
                                value={formValues.confirmPassword}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='py-4 '>
                            <Button type="submit" className={"w-full cursor-pointer p-4 rounded-md"}>
                                {registerMutation.isPending ? (<span className='flex items-center gap-2'><LoaderCircle /> Creating account... </span>) : ("Create Account")}
                            </Button>
                        </div>
                    </CardContent>

                    <CardFooter className={"flex justify-center pt-0"}>
                        <div className='text-center text-sm py-2'>
                            Already have an  account ? <a onClick={() => navigate('/login')} className='text-primary hover:underline cursor-pointer'> Sign in</a>
                        </div>
                    </CardFooter>
                </form>
            </CardHeader>
        </Card>
    )
}

export default RegisterForm