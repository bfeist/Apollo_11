import utils
import subprocess
import os
import re
import whisperx
from rich.console import Console
import signal

device = "cuda"
audio_file = "audio.mp3"
batch_size = 16  # reduce if low on GPU mem
compute_type = "float16"  # change to "int8" if low on GPU mem (may reduce accuracy)

YOUR_HF_TOKEN = "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"


def processWavWithWhisperx(wavPath, outputFile):
    with console.status("Loading model..."):
        # save model to local path (optional)
        model_dir = os.path.join(workingPath, ".model")
        model = whisperx.load_model(
            "large-v3",
            device,
            compute_type=compute_type,
            download_root=model_dir,
            language="en",
        )

    with console.status("Loading audio..."):
        audio = whisperx.load_audio(wavPath)

    with console.status("Transcribing..."):
        result = model.transcribe(
            audio,
            batch_size=batch_size,
            language="en",
        )

    # 2. Align whisper output
    with console.status("Aligning..."):
        model_a, metadata = whisperx.load_align_model(language_code="en", device=device)
        result = whisperx.align(
            result["segments"],
            model_a,
            metadata,
            audio,
            device,
            return_char_alignments=False,
        )

    # with console.status("Diarizing..."):
    #     diarize_model = whisperx.DiarizationPipeline(
    #         use_auth_token=YOUR_HF_TOKEN, device=device
    #     )

    #     # add min/max number of speakers if known
    #     diarize_segments = diarize_model(audio)
    #     # diarize_model(audio, min_speakers=min_speakers, max_speakers=max_speakers)

    # with console.status("Assigning speakers..."):
    #     result = whisperx.assign_word_speakers(diarize_segments, result)

    with console.status("Saving..."):
        with open(outputFile, "w") as f:
            f.write(result.to_json(indent=2))


# inputPath = "O:/Apollo_13_30-Track/44.1/defluttered/"
inputPath = "F:/A13_30-track/defluttered/"
workingPath = "F:/A13_whisperx_MOCR_transcription/"

# testInput = "F:/tempF/DA13_T708_HR1L_CH2__4577_4973.wav"
# processWavWithWhisperx(testInput, workingPath)

# Initialize the console for rich output
console = Console()

for root, dirs, files in os.walk(inputPath):
    for dir in dirs:
        for file in os.listdir(os.path.join(root, dir)):
            if (
                not file.endswith(".wav")
                or "CH1.wav" in file
                or "CH01.wav" in file
                or "CH30.wav" in file
                or "CH31.wav" in file
                or "CH32.wav" in file
            ):
                continue

            inputFilename = file
            inputFilenameWithPath = os.path.join(root, dir, inputFilename)

            outputFile = os.path.join(
                workingPath,
                dir.replace("_16khz", ""),
                file.replace(".wav", "") + "_whisperx_transcript.json",
            )

            if os.path.exists(outputFile):
                console.print(f"Skipping {outputFile} because it already exists")
                continue

            console.print(f"[blue]Processing {inputFilename}")
            processWavWithWhisperx(inputFilenameWithPath, outputFile)
