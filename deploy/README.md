# 🏛️ AyuSwar AI — Sovereign Cloud-Native DevOps & GitOps Architecture

> **100% Free & Open-Source (₹0 Cost / Zero Paid AWS / Zero API Keys Required)**  
> Built for the National Indic Healthcare Grid, Ayushman Bharat Digital Mission (ABDM M3), and Rural Health Center Operations.

---

## 📦 Architecture Stack Overview

| Tier | Component | Open-Source Technology | License / Standard | Port | Cost |
|---|---|---|---|---|---|
| **Edge & Clinical Core** | AyuSwar AI Web & DSP | React 19 + WebAudio 48kHz | MIT / Sovereign | `5173 / 80` | **₹0** |
| **Ingress & Mesh** | Cloud-Native Proxy | Traefik v3.0 | Apache 2.0 | `80, 8080` | **₹0** |
| **Observability** | Metrics Engine | Prometheus v2.51.0 | Apache 2.0 (CNCF) | `9090` | **₹0** |
| **Visualization** | Clinical Ops Dashboard | Grafana v10.4.0 | AGPLv3 (CNCF) | `3001` | **₹0** |
| **Telemetry Backbone** | Distributed Tracing | OpenTelemetry Collector | Apache 2.0 (CNCF) | `4317, 4318` | **₹0** |
| **Continuous Delivery** | GitOps Deployment Engine | ArgoCD Community Edition | Apache 2.0 (CNCF) | In-Cluster | **₹0** |
| **Container Engine** | Production Orchestrator | Kubernetes (K3s / Kind / Minikube) | Apache 2.0 (CNCF) | Cluster | **₹0** |

---

## ⚡ Instant 1-Command Local Startup (Docker Compose)

Run the entire hospital cluster locally with **Prometheus**, **Grafana**, and **Traefik**:

```bash
docker compose -f deploy/docker-compose.enterprise.yml up -d
```

### Access URLs:
- **AyuSwar AI Healthcare Portal:** [http://localhost:5173](http://localhost:5173) or [http://localhost](http://localhost)
- **Grafana Clinical Dashboard:** [http://localhost:3001](http://localhost:3001) *(User: `admin`, Pass: `ayuswar`)*
- **Prometheus Metrics Engine:** [http://localhost:9090](http://localhost:9090)
- **Traefik Ingress Mesh Dashboard:** [http://localhost:8080](http://localhost:8080)

---

## ☸️ Production Kubernetes / K3s Deployment

Deploy to any sovereign Kubernetes cluster (such as India National Informatics Centre MeghRaj or on-premise hospital racks):

```bash
# 1. Create Namespace & Deploy Workload
kubectl create namespace ayuswar-health
kubectl apply -f deploy/k8s/ayuswar-deployment.yaml
kubectl apply -f deploy/k8s/ayuswar-hpa.yaml
kubectl apply -f deploy/k8s/traefik-ingress.yaml

# 2. Check Pod Status and Auto-scaling
kubectl get pods -n ayuswar-health
kubectl get hpa -n ayuswar-health
```

---

## 🔄 ArgoCD Declarative GitOps Sync

```bash
kubectl apply -f deploy/argocd/ayuswar-gitops-app.yaml -n argocd
```
ArgoCD automatically detects updates in Git repository `main` branch, validates zero-defect health checks, and performs automated self-healing without manual deployment intervention.

