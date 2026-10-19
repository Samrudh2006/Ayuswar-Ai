#!/bin/bash
# ==============================================================================
# AyuSwar AI — Gnani Evon (v3.3-30B-A3B) vLLM Sovereign Inference Server
# Model: gnani/gnani-evon-v3.3-30B-A3B (Apache 2.0 on Hugging Face)
# Architecture: Hybrid Mamba + MoE (30B total, ~3.5B active/token), 128K Context
# ==============================================================================

set -e

echo "=== AYUSWAR AI: STARTING GNANI EVON 30B vLLM INFERENCE SERVER ==="

# 1. Environment Configuration
MODEL_ID="gnani/gnani-evon-v3.3-30B-A3B"
PORT="${PORT:-8000}"
HOST="${HOST:-0.0.0.0}"
MAX_MODEL_LEN="${MAX_MODEL_LEN:-8192}"
GPU_MEMORY_UTILIZATION="${GPU_MEMORY_UTILIZATION:-0.92}"
TENSOR_PARALLEL_SIZE="${TENSOR_PARALLEL_SIZE:-1}"
HF_TOKEN="${HF_TOKEN:-$HUGGING_FACE_HUB_TOKEN}"

# 2. Check for GPU Availability
if ! command -v nvidia-smi &> /dev/null; then
    echo "⚠️ Warning: nvidia-smi not detected. Ensure you are running on an NVIDIA CUDA-enabled GPU (A100/H100/L40S recommended)."
fi

# 3. Check for Hugging Face Token (Evon weights are gated Apache 2.0)
if [ -z "$HF_TOKEN" ]; then
    echo "⚠️ NOTICE: HF_TOKEN is not set in environment."
    echo "Please request weight access at: https://huggingface.co/gnani/gnani-evon-v3.3-30B-A3B"
    echo "Export your token before running: export HF_TOKEN='your_hf_token_here'"
fi

# 4. Start vLLM OpenAI-Compatible Server
echo "🚀 Launching vLLM Server on http://${HOST}:${PORT}/v1..."
echo "Model: ${MODEL_ID}"
echo "Context Window: ${MAX_MODEL_LEN} tokens"

python3 -m vllm.entrypoints.openai.api_server \
    --model "${MODEL_ID}" \
    --host "${HOST}" \
    --port "${PORT}" \
    --max-model-len "${MAX_MODEL_LEN}" \
    --gpu-memory-utilization "${GPU_MEMORY_UTILIZATION}" \
    --tensor-parallel-size "${TENSOR_PARALLEL_SIZE}" \
    --dtype bfloat16 \
    --trust-remote-code \
    --served-model-name "gnani/gnani-evon-v3.3-30B-A3B"

# ==============================================================================
# Connect to AyuSwar AI:
# Set the following in your AyuSwar AI server environment:
# EVON_BASE_URL="http://your-server-ip:8000/v1"
# EVON_API_KEY="optional-bearer-token"
# ==============================================================================
