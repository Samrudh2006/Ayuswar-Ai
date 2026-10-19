#!/bin/bash
# ==============================================================================
# AyuSwar AI — 1-Command Docker Run for Gnani Evon 30B vLLM Server
# Usage: ./scripts/docker_run_evon_vllm.sh <HF_TOKEN>
# ==============================================================================

HF_TOKEN="${1:-$HF_TOKEN}"

if [ -z "$HF_TOKEN" ]; then
    echo "Usage: ./scripts/docker_run_evon_vllm.sh <YOUR_HUGGINGFACE_TOKEN>"
    exit 1
fi

docker run --gpus all \
    -v ~/.cache/huggingface:/root/.cache/huggingface \
    --env "HUGGING_FACE_HUB_TOKEN=${HF_TOKEN}" \
    -p 8000:8000 \
    --ipc=host \
    vllm/vllm-openai:latest \
    --model gnani/gnani-evon-v3.3-30B-A3B \
    --tensor-parallel-size 1 \
    --max-model-len 8192 \
    --dtype bfloat16 \
    --trust-remote-code
