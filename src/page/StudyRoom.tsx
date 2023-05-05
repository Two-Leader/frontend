import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Webcam from 'react-webcam';
import 'bootstrap/dist/css/bootstrap.min.css';

const theme = createTheme();

export default function StudyRoom() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        <div>
          <Webcam audio />
        </div>
      </main>
    </ThemeProvider>
  );
}
