import { ProjectDetailView } from "@/components/projects/ProjectDetailView";
import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/data";

export const dynamic = "force-dynamic";

const getFallbackProject = (id: string) => ({
  id,
  title: "Cloud Infrastructure Automation",
  description: "A comprehensive solution for automating cloud infrastructure provisioning and management using Terraform and Ansible.",
  category: "Infrastructure",
  tags: ["Terraform", "AWS", "Ansible", "DevOps"],
  status: "live" as const,
  imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
  content: `
# Overview

This project implements a fully automated infrastructure provisioning pipeline using Terraform and Ansible. It targets AWS as cloud provider and ensures that all resources are created and managed in a reproducible manner.

## The Problem

Manual infrastructure management is error-prone, slow, and hard to audit. Our team faced significant delays in environment provisioning, leading to reduced developer productivity.

## Inspiration

Inspired by "Immutable Infrastructure" methodologies promoted by Netflix and wider DevOps community, I decided to build a system that treats infrastructure as code.

## Challenges

One of main challenges was managing state across multiple environments (Dev, Staging, Prod). Terraform state locking was implemented using DynamoDB to prevent concurrent modifications.

## Solutions
### Terraform Modules

We created reusable Terraform modules for:
- VPC Networking
- ECS Clusters
- RDS Databases

### Ansible Configuration

Ansible was used for the configuration management of EC2 instances that required specific software packages not available in standard AMIs.

## Technical Stack

- **Infrastructure:** AWS (EC2, RDS, VPC, S3)
- **IaC:** Terraform
- **Configuration:** Ansible
- **CI/CD:** GitHub Actions

## What I Learned

Deep dived into AWS networking concepts such as Subnets, Route Tables, and Internet Gateways. I also mastered the art of writing idempotent Ansible playbooks.

## Final Outcome

The final result is a "one-click" environment creation script that spins up a production-ready stack in under 15 minutes, down from 2 days.
  `,
  createdAt: new Date(),
  updatedAt: new Date(),
});

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const project = await getProjectById(id);

  if (!project) {
    if (process.env.NODE_ENV === 'development') {
       return <ProjectDetailView project={getFallbackProject(id)} />;
    }
    return notFound();
  }

  return <ProjectDetailView project={project} />;
}
