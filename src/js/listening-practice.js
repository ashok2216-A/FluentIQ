// Listening Practice Functionality
function initListeningPractice() {
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    const audioPlayer = document.querySelector('.audio-player');
    const playBtn = document.querySelector('.play-btn');
    const replayBtn = document.querySelector('.replay-btn');
    const progressBar = document.querySelector('.progress-container .progress-bar');
    const timeDisplay = document.querySelector('.time-display');
    const transcriptBtn = document.querySelector('#show-transcript');
    const transcript = document.querySelector('.transcript');
    const questions = document.querySelectorAll('.question');
    const checkAnswerBtn = document.querySelector('#check-answer');
    const nextQuestionBtn = document.querySelector('#next-question');
    const prevQuestionBtn = document.querySelector('#prev-question');
    const feedback = document.querySelector('.feedback');
    const feedbackText = document.querySelector('.feedback-text');
    const scoreValue = document.querySelector('.score-value');
    const progressFill = document.querySelector('.exercise-progress .progress-fill');
    const progressText = document.querySelector('.progress-text');

    let currentQuestion = 0;
    let audio = null;
    let isPlaying = false;
    let userAnswers = {};
    let correctAnswers = {
        q1: 'b', // Went hiking
        q2: 'b'  // Great
    };

    // Initialize audio player
    if (audioPlayer) {
        // Create a new Audio object
        audio = new Audio();
        audio.src = 'src/audio/daily-conversation.mp3'; // Update with your actual audio file path
        
        // Update progress bar and time display
        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                const progress = (audio.currentTime / audio.duration) * 100;
                progressBar.style.width = `${progress}%`;
                
                const minutes = Math.floor(audio.currentTime / 60);
                const seconds = Math.floor(audio.currentTime % 60);
                const totalMinutes = Math.floor(audio.duration / 60);
                const totalSeconds = Math.floor(audio.duration % 60);
                timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} / ${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
            }
        });

        // Handle audio end
        audio.addEventListener('ended', () => {
            isPlaying = false;
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        });

        // Handle audio error
        audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            feedback.style.display = 'block';
            feedbackText.textContent = 'Error loading audio file. Please try again.';
        });
    }

    // Handle difficulty selection
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            difficultyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Reset exercise state
            resetExercise();
            // Load new exercise based on difficulty
            loadExercise(btn.dataset.level);
        });
    });

    // Handle play/pause button
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (!audio) return;
            
            if (isPlaying) {
                audio.pause();
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
            } else {
                audio.play().catch(error => {
                    console.error('Playback failed:', error);
                    feedback.style.display = 'block';
                    feedbackText.textContent = 'Error playing audio. Please try again.';
                });
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
            isPlaying = !isPlaying;
        });
    }

    // Handle replay button
    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            if (!audio) return;
            
            audio.currentTime = 0;
            audio.play().catch(error => {
                console.error('Replay failed:', error);
                feedback.style.display = 'block';
                feedbackText.textContent = 'Error replaying audio. Please try again.';
            });
            isPlaying = true;
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        });
    }

    // Handle transcript toggle
    if (transcriptBtn) {
        transcriptBtn.addEventListener('click', () => {
            const isVisible = transcript.style.display !== 'none';
            transcript.style.display = isVisible ? 'none' : 'block';
            transcriptBtn.innerHTML = isVisible ? 
                '<i class="fas fa-eye"></i> Show Transcript' : 
                '<i class="fas fa-eye-slash"></i> Hide Transcript';
        });
    }

    // Handle question navigation
    function showQuestion(index) {
        questions.forEach((question, i) => {
            question.style.display = i === index ? 'block' : 'none';
        });

        // Update navigation buttons
        prevQuestionBtn.disabled = index === 0;
        nextQuestionBtn.disabled = index === questions.length - 1;
        
        // Show/hide check answer button
        checkAnswerBtn.style.display = index === questions.length - 1 ? 'block' : 'none';
        
        // Update progress
        const progress = ((index + 1) / questions.length) * 100;
        progressFill.style.width = `${progress}%`;
    }

    // Handle next question
    if (nextQuestionBtn) {
        nextQuestionBtn.addEventListener('click', () => {
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                showQuestion(currentQuestion);
            }
        });
    }

    // Handle previous question
    if (prevQuestionBtn) {
        prevQuestionBtn.addEventListener('click', () => {
            if (currentQuestion > 0) {
                currentQuestion--;
                showQuestion(currentQuestion);
            }
        });
    }

    // Handle check answer
    if (checkAnswerBtn) {
        checkAnswerBtn.addEventListener('click', () => {
            let score = 0;
            let total = questions.length;

            questions.forEach((question, index) => {
                const selectedAnswer = question.querySelector('input:checked');
                const questionName = `q${index + 1}`;
                
                if (selectedAnswer) {
                    userAnswers[questionName] = selectedAnswer.value;
                    if (selectedAnswer.value === correctAnswers[questionName]) {
                        score++;
                    }
                }
            });

            // Show feedback
            feedback.style.display = 'block';
            feedbackText.textContent = `You got ${score} out of ${total} questions correct!`;
            scoreValue.textContent = `${score}/${total}`;

            // Update progress
            const progress = (score / total) * 100;
            progressFill.style.width = `${progress}%`;
        });
    }

    // Reset exercise state
    function resetExercise() {
        currentQuestion = 0;
        userAnswers = {};
        feedback.style.display = 'none';
        progressFill.style.width = '0%';
        showQuestion(0);
        
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            isPlaying = false;
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    // Load exercise based on difficulty
    function loadExercise(level) {
        // Here you would typically load different exercises based on difficulty
        // For now, we'll just reset the current exercise
        resetExercise();
    }

    // Initialize
    showQuestion(0);
}

// Export the initialization function
export { initListeningPractice }; 