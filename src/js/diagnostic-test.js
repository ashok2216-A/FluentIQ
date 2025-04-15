// Diagnostic Test Functionality
function initDiagnosticTest() {
    const sections = document.querySelectorAll('.test-section');
    const progressFill = document.querySelector('.progress-fill');
    const steps = document.querySelectorAll('.step');
    const nextBtn = document.querySelector('#next-section');
    const prevBtn = document.querySelector('#prev-section');
    const audioPlayer = document.querySelector('.audio-player');
    const playBtn = document.querySelector('.play-btn');
    const replayBtn = document.querySelector('#replay-audio');
    const pauseBtn = document.querySelector('#pause-audio');
    const progressBar = document.querySelector('.audio-player .progress-bar');
    const timeDisplay = document.querySelector('.time-display');
    const writingArea = document.querySelector('.writing-area textarea');
    const wordCount = document.querySelector('.word-count span');
    const writingTimer = document.querySelector('.writing-timer span');

    let currentSection = 0;
    let audio = null;
    let isPlaying = false;
    let writingTimeLeft = 40 * 60; // 40 minutes in seconds
    let writingTimerInterval = null;

    // Initialize audio player
    if (audioPlayer) {
        audio = new Audio('path/to/audio-file.mp3');
        
        audio.addEventListener('timeupdate', () => {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progress}%`;
            
            const minutes = Math.floor(audio.currentTime / 60);
            const seconds = Math.floor(audio.currentTime % 60);
            const totalMinutes = Math.floor(audio.duration / 60);
            const totalSeconds = Math.floor(audio.duration % 60);
            timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} / ${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
        });

        audio.addEventListener('ended', () => {
            isPlaying = false;
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        });
    }

    // Handle play/pause button
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (isPlaying) {
                audio.pause();
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
            } else {
                audio.play();
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
            isPlaying = !isPlaying;
        });
    }

    // Handle replay button
    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            if (audio) {
                audio.currentTime = 0;
                audio.play();
                isPlaying = true;
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
        });
    }

    // Handle pause button
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            if (audio) {
                audio.pause();
                isPlaying = false;
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
    }

    // Handle word count
    if (writingArea && wordCount) {
        writingArea.addEventListener('input', () => {
            const words = writingArea.value.trim().split(/\s+/).filter(word => word.length > 0);
            wordCount.textContent = words.length;
        });
    }

    // Handle writing timer
    if (writingTimer) {
        function updateWritingTimer() {
            const minutes = Math.floor(writingTimeLeft / 60);
            const seconds = writingTimeLeft % 60;
            writingTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (writingTimeLeft <= 0) {
                clearInterval(writingTimerInterval);
                writingArea.disabled = true;
            } else {
                writingTimeLeft--;
            }
        }

        writingTimerInterval = setInterval(updateWritingTimer, 1000);
    }

    // Update progress bar and steps
    function updateProgress() {
        const progress = ((currentSection + 1) / sections.length) * 100;
        progressFill.style.width = `${progress}%`;
        
        steps.forEach((step, index) => {
            if (index <= currentSection) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    // Show current section
    function showSection(index) {
        sections.forEach((section, i) => {
            if (i === index) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        // Update button states
        prevBtn.disabled = index === 0;
        nextBtn.textContent = index === sections.length - 1 ? 'Submit Test' : 'Next Section';
    }

    // Handle next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentSection < sections.length - 1) {
                currentSection++;
                showSection(currentSection);
                updateProgress();
            } else {
                // Handle test submission
                submitTest();
            }
        });
    }

    // Handle previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentSection > 0) {
                currentSection--;
                showSection(currentSection);
                updateProgress();
            }
        });
    }

    // Initialize test
    showSection(0);
    updateProgress();

    // Handle test submission
    function submitTest() {
        // Collect all answers
        const answers = {
            speaking: document.querySelector('.recording-status')?.textContent || '',
            writing: writingArea ? writingArea.value : '',
            listening: Array.from(document.querySelectorAll('#listening-section .options input:checked')).map(input => input.value),
            reading: Array.from(document.querySelectorAll('#reading-section .options input:checked')).map(input => input.value)
        };

        // Send answers to server
        fetch('/api/submit-diagnostic-test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(answers)
        })
        .then(response => response.json())
        .then(data => {
            // Handle response
            if (data.success) {
                window.location.href = '/results.html';
            } else {
                alert('There was an error submitting your test. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting your test. Please try again.');
        });
    }
}

class DiagnosticTest {
    constructor() {
        this.scrollContainer = document.querySelector('.test-scroll-container');
        this.scrollThumb = document.querySelector('.scroll-thumb');
        this.scrollTrack = document.querySelector('.scroll-track');
        this.initScroll();
    }

    initScroll() {
        if (this.scrollContainer && this.scrollThumb) {
            // Update scroll thumb position on scroll
            this.scrollContainer.addEventListener('scroll', () => {
                this.updateScrollThumb();
            });

            // Handle scroll thumb drag
            let isDragging = false;
            this.scrollThumb.addEventListener('mousedown', (e) => {
                isDragging = true;
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                const trackRect = this.scrollTrack.getBoundingClientRect();
                const thumbHeight = this.scrollThumb.offsetHeight;
                const maxY = trackRect.height - thumbHeight;
                let y = e.clientY - trackRect.top - thumbHeight / 2;
                
                // Constrain y position
                y = Math.max(0, Math.min(y, maxY));
                
                // Calculate scroll position
                const scrollRatio = y / maxY;
                const maxScroll = this.scrollContainer.scrollHeight - this.scrollContainer.clientHeight;
                this.scrollContainer.scrollTop = scrollRatio * maxScroll;
                
                this.updateScrollThumb();
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });

            // Initial update
            this.updateScrollThumb();
        }
    }

    updateScrollThumb() {
        const scrollRatio = this.scrollContainer.scrollTop / (this.scrollContainer.scrollHeight - this.scrollContainer.clientHeight);
        const maxY = this.scrollTrack.offsetHeight - this.scrollThumb.offsetHeight;
        this.scrollThumb.style.transform = `translateY(${scrollRatio * maxY}px)`;
    }
}

// Initialize the diagnostic test
document.addEventListener('DOMContentLoaded', () => {
    new DiagnosticTest();
}); 