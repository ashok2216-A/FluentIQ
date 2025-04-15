// Speaking Practice Module
class SpeakingPractice {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.audioContext = null;
        this.analyser = null;
        this.visualizer = null;
        this.timerInterval = null;
        this.timeLeft = 120; // 2 minutes in seconds

        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.startButton = document.getElementById('start-recording');
        this.stopButton = document.getElementById('stop-recording');
        this.playButton = document.getElementById('play-recording');
        this.timerDisplay = document.getElementById('speaking-timer');
        this.visualizerCanvas = document.getElementById('audio-visualizer');
        this.visualizerContext = this.visualizerCanvas.getContext('2d');
    }

    setupEventListeners() {
        this.startButton.addEventListener('click', () => this.startRecording());
        this.stopButton.addEventListener('click', () => this.stopRecording());
        this.playButton.addEventListener('click', () => this.playRecording());
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];

            // Setup audio visualization
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            const source = this.audioContext.createMediaStreamSource(stream);
            source.connect(this.analyser);
            this.analyser.fftSize = 256;
            this.visualize();

            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };

            this.mediaRecorder.start();
            this.isRecording = true;
            this.startButton.disabled = true;
            this.stopButton.disabled = false;
            this.startTimer();
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Please allow microphone access to use this feature.');
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.stopButton.disabled = true;
            this.playButton.disabled = false;
            this.stopTimer();
            
            // Stop all tracks
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
    }

    playRecording() {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
    }

    visualize() {
        if (!this.analyser) return;

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            if (!this.isRecording) return;

            requestAnimationFrame(draw);
            this.analyser.getByteFrequencyData(dataArray);

            this.visualizerContext.fillStyle = 'rgb(200, 200, 200)';
            this.visualizerContext.fillRect(0, 0, this.visualizerCanvas.width, this.visualizerCanvas.height);

            const barWidth = (this.visualizerCanvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;

                this.visualizerContext.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
                this.visualizerContext.fillRect(x, this.visualizerCanvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        };

        draw();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            this.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (this.timeLeft <= 0) {
                this.stopRecording();
            }
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timerInterval);
    }

    // Simulate AI analysis (to be replaced with actual AI integration)
    analyzeSpeech() {
        // This would be replaced with actual AI analysis
        return {
            pronunciation: 7.5,
            fluency: 8.0,
            grammar: 7.0,
            feedback: {
                pronunciation: [
                    'Good vowel sounds',
                    'Clear consonant pronunciation',
                    'Needs work on word stress'
                ],
                fluency: [
                    'Good pace and rhythm',
                    'Natural pauses',
                    'Some hesitation points'
                ],
                grammar: [
                    'Good sentence structure',
                    'Minor tense errors',
                    'Accurate use of articles'
                ]
            }
        };
    }
}

// Initialize the speaking practice module when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SpeakingPractice();
}); 