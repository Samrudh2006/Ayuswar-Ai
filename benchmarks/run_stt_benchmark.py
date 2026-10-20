#!/usr/bin/env python3
"""
AyuSwar AI — Indic STT Benchmark Evaluation Suite
Evaluates Word Error Rate (WER), Character Error Rate (CER), and Medical-Term Accuracy (MTA).
Compares Browser WebSpeech Recognition vs. Gnani Prisma v3 Indic STT across 50 OPD Sentences.
"""

import sys
import os
import re
import unicodedata
import pandas as pd

try:
    import jiwer
except ImportError:
    print("[!] jiwer not installed. Please run: pip install jiwer pandas")
    sys.exit(1)

def norm(s):
    """Normalize text using Unicode NFC, lowercasing, punctuation/symbol stripping without breaking Indic matras."""
    s = unicodedata.normalize("NFC", str(s)).lower()
    s = "".join(" " if unicodedata.category(c)[0] in "PS" else c for c in s)
    return " ".join(s.split())

def calculate_wer_cer(refs_df, hyps_df, hyp_col="browser_stt", ref_col="ref_n"):
    """Computes corpus-level WER & CER along with per-sentence error metrics."""
    h = hyps_df.set_index("id")[hyp_col].map(norm)
    r = refs_df.set_index("id")[ref_col]
    rows = [(i, r[i], h.get(i, "")) for i in refs_df["id"]]
    rt = [x[1] for x in rows]
    ht = [x[2] for x in rows]

    w = jiwer.wer(rt, ht)
    c = jiwer.cer(rt, ht)

    per_sentence = pd.DataFrame([
        {
            "id": i,
            "wer": jiwer.wer(a, b) if b else 1.0,
            "cer": jiwer.cer(a, b) if b else 1.0,
            "ref": a,
            "hyp": b
        }
        for i, a, b in rows
    ])

    return w, c, per_sentence

def calculate_term_accuracy(refs_df, hyps_df, hyp_col="browser_stt"):
    """
    Computes Medical-Term Accuracy (MTA) — the critical clinical patient-safety metric.
    Tracks exact alias matching across drug names, diagnoses, and medical abbreviations.
    """
    h = hyps_df.set_index("id")[hyp_col].map(norm)
    total = 0
    hit = 0
    missed = []

    for _, row in refs_df.iterrows():
        terms = [t.strip() for t in str(row["medical_terms"]).split(";") if t.strip()]
        for t in terms:
            aliases = [norm(a) for a in t.split("|")]
            total += 1
            sentence_hyp = h.get(row["id"], "")
            if any(a and a in sentence_hyp for a in aliases):
                hit += 1
            else:
                missed.append({
                    "id": row["id"],
                    "term": t,
                    "hyp": sentence_hyp
                })

    acc = hit / total if total else 0.0
    return hit, total, acc, pd.DataFrame(missed)

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    refs_path = os.path.join(base_dir, "data", "ayuswar_50_eval_refs.csv")
    hyps_arg = sys.argv[1] if len(sys.argv) > 1 else None
    if hyps_arg and os.path.exists(hyps_arg):
        hyps_path = hyps_arg
    else:
        sample_path = os.path.join(base_dir, "data", "ayuswar_50_eval_hyps_sample.csv")
        template_path = os.path.join(base_dir, "data", "ayuswar_50_eval_hyps_template.csv")
        hyps_path = sample_path if os.path.exists(sample_path) else template_path

    if not os.path.exists(refs_path):
        print(f"Error: References file not found at {refs_path}")
        return

    refs = pd.read_csv(refs_path)
    hyps = pd.read_csv(hyps_path)

    # Apply Sarthak normalization
    REF_COL = "reference_native"
    refs["ref_n"] = refs[REF_COL].map(norm)

    print("======================================================================")
    print("AYUSWAR AI — INDIC STT BENCHMARK EVALUATION (50 OPD SENTENCES)")
    print("Languages: Telugu (opd_01-20), Hindi (opd_21-35), Code-Mixed (opd_36-50)")
    print("======================================================================")

    for col in ["browser_stt", "gnani_prisma"]:
        if col not in hyps.columns or hyps[col].fillna("").str.strip().eq("").all():
            print(f"\n[i] {col}: Transcripts column empty or not populated yet. (Skip)")
            continue

        w, c, per = calculate_wer_cer(refs, hyps, col)
        hit, total, acc, missed_df = calculate_term_accuracy(refs, hyps, col)

        print(f"\n--- {col.upper()} RESULTS ---")
        print(f"  • Word Error Rate (WER)     : {w:.3f} ({w*100:.1f}%)")
        print(f"  • Character Error Rate (CER): {c:.3f} ({c*100:.1f}%)")
        print(f"  • Medical-Term Accuracy     : {hit}/{total} ({acc:.1%})")

        out_csv = os.path.join(base_dir, f"ayuswar_stt_results_{col}.csv")
        per[["id", "wer", "cer", "ref", "hyp"]].to_csv(out_csv, index=False)
        print(f"  • Saved per-sentence audit to: {out_csv}")

if __name__ == "__main__":
    main()
