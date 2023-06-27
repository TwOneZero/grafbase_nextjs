import { ProjectInterface } from "@/common.types";
import ProjectCard from "@/components/ProjectCard";
import { fetchAllProjects } from "@/lib/actions";
import React from "react";

type ProjectsSearch = {
  projectSearch: {
    edges: { node: ProjectInterface }[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: String;
    };
  };
};

const Home = async () => {
  const data = (await fetchAllProjects()) as ProjectsSearch;

  const projectsDisplay = data?.projectSearch?.edges || [];

  if (projectsDisplay.length === 0) {
    return (
      <section className="flexStart flex-col paddings">
        Categories
        <p className="no-result-text text-center">
          No projects found, go create some first.
        </p>
      </section>
    );
  }

  return (
    <section className="flex-start flex-col paddings mb-16">
      <h1>Categories</h1>
      <section className="projects-grid">
        {projectsDisplay.map(({ node }: { node: ProjectInterface }) => (
          <ProjectCard
            key={node?.id}
            id={node?.id}
            image={node?.image}
            title={node?.title}
            name={node?.createdBy?.name}
            avartarUrl={node?.createdBy?.avatarUrl}
            userId={node?.createdBy?.id}
          />
        ))}
      </section>
      <h1>LoadMore</h1>
    </section>
  );
};

export default Home;
