import Container from '../components/LoginPage/Container.tsx';

const LoginPage: React.FC = () => {


    return (
        <div className="flex h-screen w-full" style={{backgroundColor: '#031A6B'}}>
            <div className="w-1/2 flex flex-col items-center justify-center">
                <Container/>

            </div>

            <div className="w-1/2 flex items-center justify-center">
                <img
                    src="/globe.png"
                    alt="Globe"
                    className="w-2/3 max-w-md object-contain mt-6"
                />
            </div>
        </div>
    );
};

export default LoginPage;
